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
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-center">
          Daily Ad Revenue Distribution
        </CardTitle>
        <div className="text-center text-sm text-gray-600">
          Total Ad Payment: <span className="font-bold text-green-600">${adPayment}</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(1)}%`}
                outerRadius={80}
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
        
        <div className="mt-4 space-y-2">
          <div className="flex justify-between items-center p-2 bg-blue-50 rounded">
            <span className="text-sm font-medium">Estimated Viewers:</span>
            <span className="font-bold">{estimatedViewers.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-green-50 rounded">
            <span className="text-sm font-medium">Reward per User:</span>
            <span className="font-bold text-green-600">${rewardPerUser.toFixed(4)}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs mt-3">
            <div className="text-center">
              <div className="w-3 h-3 bg-blue-500 rounded mx-auto mb-1"></div>
              <div className="font-medium">User Rewards</div>
              <div className="text-green-600">${userRewards.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-red-500 rounded mx-auto mb-1"></div>
              <div className="font-medium">Platform Fee</div>
              <div className="text-red-600">${platformFee.toFixed(2)}</div>
            </div>
            <div className="text-center">
              <div className="w-3 h-3 bg-yellow-500 rounded mx-auto mb-1"></div>
              <div className="font-medium">Operating Costs</div>
              <div className="text-yellow-600">${operatingCosts.toFixed(2)}</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}