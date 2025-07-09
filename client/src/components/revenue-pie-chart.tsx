import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface RevenuePieChartProps {
  adPayment: number;
  estimatedViewers: number;
}

export default function RevenuePieChart({ adPayment, estimatedViewers }: RevenuePieChartProps) {
  // Revenue distribution calculation
  const platformFee = adPayment * 0.15; // 15% platform fee
  const operatingCosts = adPayment * 0.10; // 10% operating costs
  const userRewards = adPayment * 0.75; // 75% distributed to users
  const rewardPerUser = estimatedViewers > 0 ? userRewards / estimatedViewers : 0;

  const data = [
    { name: 'User Rewards', value: userRewards, color: '#3b82f6' },
    { name: 'Platform Fee', value: platformFee, color: '#ef4444' },
    { name: 'Operating Costs', value: operatingCosts, color: '#f59e0b' },
  ];

  const COLORS = data.map(item => item.color);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold">{data.name}</p>
          <p className="text-green-600">${data.value.toFixed(2)}</p>
          <p className="text-sm text-gray-600">
            {((data.value / adPayment) * 100).toFixed(1)}% of total
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-center">
          Ad Revenue Distribution
        </CardTitle>
        <div className="text-center text-xs text-gray-600">
          Total: <span className="font-bold text-green-600">${adPayment}</span>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                outerRadius={60}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-3 space-y-2">
          <div className="flex justify-between items-center p-2 bg-blue-50 rounded text-xs">
            <span className="font-medium">Viewers:</span>
            <span className="font-bold">{estimatedViewers.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50 rounded text-xs">
            <span className="font-medium">Per User:</span>
            <span className="font-bold text-green-600">${rewardPerUser.toFixed(4)}</span>
          </div>
          <div className="space-y-1 text-xs mt-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded mr-2"></div>
                <span>User Rewards</span>
              </div>
              <span className="text-green-600 font-medium">${userRewards.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-red-500 rounded mr-2"></div>
                <span>Platform Fee</span>
              </div>
              <span className="text-red-600 font-medium">${platformFee.toFixed(0)}</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-yellow-500 rounded mr-2"></div>
                <span>Operating</span>
              </div>
              <span className="text-yellow-600 font-medium">${operatingCosts.toFixed(0)}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}