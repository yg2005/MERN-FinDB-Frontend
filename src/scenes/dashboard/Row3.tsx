import BoxHeader from '@/components/BoxHeader';
import DashboardBox from '@/components/DashboardBox';
import FlexBetween from '@/components/FlexBetween';
import { useGetKpisQuery, useGetProductsQuery, useGetTransationsQuery } from '@/state/api';
import { Box, Typography, useTheme } from '@mui/material';
import { DataGrid, GridCellParams } from '@mui/x-data-grid';
import { useMemo } from 'react';
import { Cell, Pie, PieChart, Tooltip } from 'recharts';



const Row3 = () => {
  const { data: transactionData } = useGetTransationsQuery();
  const { data: productData } = useGetProductsQuery();
  const { data: kpiData } = useGetKpisQuery();
  const { palette } = useTheme();
  const pieColors = [palette.primary[800], palette.primary[500]];

  const pieChartData = useMemo(() => {
    if (kpiData){
      const totalExpenses = kpiData[0].totalExpenses;
      return Object.entries(kpiData[0].expensesByCategory).map(
        ([key, value]) => {
          return [
            {
              name: key,
              value: value,
            },
            {
              name: `${key} of Total`,
              value: totalExpenses - value
            }
          ];
        }
      );
    }
  }, [kpiData]);

  const productColumns = [
    { 
      field: '_id',
      headerName: 'id', 
      flex: 1,
    },
    { 
      field: 'expense',
      headerName: 'Expense', 
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    { 
      field: 'price',
      headerName: 'Price', 
      flex: 0.5,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
  ];

  const transactionColumns = [
    { 
      field: '_id',
      headerName: 'id', 
      flex: 1,
    },
    { 
      field: 'buyer',
      headerName: 'Buyer', 
      flex: 0.67,
    },
    { 
      field: 'amount',
      headerName: 'Amount', 
      flex: 0.35,
      renderCell: (params: GridCellParams) => `$${params.value}`,
    },
    { 
      field: 'productIds',
      headerName: 'Count', 
      flex: 0.1,
      renderCell: (params: GridCellParams) => (params.value as Array<string>).length,
    },
  ];

  return (
    <>
      <DashboardBox gridArea="g">
        <BoxHeader
          title="List of Products"
          sideText={`${productData?.length} products`}
        />
        <Box
          mt="0.5rem"
          p="0 0.5rem"
          height="75%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[700]} !important`,
              borderWidth: '0.5px',
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[700]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid 
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={productData || []}
            columns={productColumns}
          />
        </Box>
      </DashboardBox>

      <DashboardBox gridArea="h">
        <BoxHeader
          title="Recent Orders"
          sideText={`${transactionData?.length} latest transactions`}
        />
        <Box
          mt="1rem"
          p="0 0.5rem"
          height="80%"
          sx={{
            "& .MuiDataGrid-root": {
              color: palette.grey[300],
              border: "none",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: `1px solid ${palette.grey[700]} !important`,
              borderWidth: '0.5px',
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: `1px solid ${palette.grey[700]} !important`,
            },
            "& .MuiDataGrid-columnSeparator": {
              visibility: "hidden",
            },
          }}
        >
          <DataGrid 
            columnHeaderHeight={25}
            rowHeight={35}
            hideFooter={true}
            rows={transactionData || []}
            columns={transactionColumns}
          />
        </Box>
      </DashboardBox>

      <DashboardBox gridArea="i">
        <BoxHeader title="Expense Breakdown By Category" sideText="+4%" />
        <FlexBetween mt="0.5rem" gap="0.5rem" p="0 1rem" textAlign="center">
          {pieChartData?.map((data, i) => (
            <Box key={`${data[0].name}-${i}`} mb="1rem">
              <PieChart width={90} height={80}>
                <Pie
                  stroke="none"
                  data={data}
                  innerRadius={15}
                  outerRadius={30}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => `$${value.toFixed(2)}`}
                  contentStyle={{ backgroundColor: palette.grey[800], borderColor: palette.grey[700] }}
                  itemStyle={{ color: palette.grey[300] }}
                />
              </PieChart>
              <Typography variant="h6" mt="-0.5rem">{data[0].name}</Typography> 
            </Box>
          ))}
        </FlexBetween>
      </DashboardBox>

      <DashboardBox gridArea="j">
        <BoxHeader title="Overall Summary and Explanation of Data" sideText="+4%" />
          <Box
            height="15px"
            margin="1.25rem 1rem 0.4rem 1rem"
            bgcolor={palette.primary[800]}
            borderRadius="1rem"
          >
            <Box
              height="15px"
              bgcolor={palette.primary[600]}
              borderRadius="1rem"
              width="40%"
            >
            </Box>
          </Box>
          <Typography margin="0 1rem" variant="h6">
          The financial overview shows a $212,000 profit from $283,000 revenue and $71,000 expenses. Monthly peaks in October and November, detailed product profitability, and key expenses in salaries, supplies, and services offer insights for strategic decisions, cost management, and sales optimization.
          </Typography>
      </DashboardBox>  
    </>
  );
};

export default Row3;
