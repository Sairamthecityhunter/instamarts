import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import {
  FiTrendingUp,
  FiUsers,
  FiShoppingCart,
  FiDollarSign,
  FiPackage,
  FiTruck,
  FiStar,

  FiDownload,
  FiRefreshCw,
  FiMapPin,
  FiClock,

  FiTrendingDown,
  FiAlertCircle,
  FiCheckCircle
} from 'react-icons/fi';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  activeUsers: number;
  avgDeliveryTime: number;
  completionRate: number;
  customerSatisfaction: number;
  totalProducts: number;
  darkStores: number;
  subscriptions: number;
  groupOrders: number;
  carbonSaved: number;
  loyaltyMembers: number;
}

interface OrderData {
  time: string;
  orders: number;
  revenue: number;
}

interface ProductPerformance {
  id: string;
  name: string;
  category: string;
  sales: number;
  revenue: number;
  rating: number;
  stock: number;
  trend: 'up' | 'down' | 'stable';
}

interface DeliveryMetrics {
  zone: string;
  avgTime: number;
  orders: number;
  satisfaction: number;
  efficiency: number;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orderData, setOrderData] = useState<OrderData[]>([]);
  const [productPerformance, setProductPerformance] = useState<ProductPerformance[]>([]);
  const [deliveryMetrics, setDeliveryMetrics] = useState<DeliveryMetrics[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('orders');

  useEffect(() => {
    loadDashboardData();
  }, [selectedTimeRange]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Mock dashboard data
      const mockStats: DashboardStats = {
        totalOrders: 15847,
        totalRevenue: 2850000,
        activeUsers: 8924,
        avgDeliveryTime: 18.5,
        completionRate: 97.8,
        customerSatisfaction: 4.6,
        totalProducts: 12456,
        darkStores: 24,
        subscriptions: 2341,
        groupOrders: 156,
        carbonSaved: 1847.5,
        loyaltyMembers: 5632
      };

      const mockOrderData: OrderData[] = [
        { time: '00:00', orders: 45, revenue: 12500 },
        { time: '02:00', orders: 28, revenue: 8200 },
        { time: '04:00', orders: 15, revenue: 4500 },
        { time: '06:00', orders: 85, revenue: 22000 },
        { time: '08:00', orders: 156, revenue: 42000 },
        { time: '10:00', orders: 234, revenue: 65000 },
        { time: '12:00', orders: 312, revenue: 89000 },
        { time: '14:00', orders: 289, revenue: 78000 },
        { time: '16:00', orders: 267, revenue: 72000 },
        { time: '18:00', orders: 398, revenue: 112000 },
        { time: '20:00', orders: 445, revenue: 125000 },
        { time: '22:00', orders: 267, revenue: 74000 }
      ];

      const mockProductPerformance: ProductPerformance[] = [
        {
          id: '1',
          name: 'Fresh Milk 500ml',
          category: 'Dairy',
          sales: 2847,
          revenue: 79716,
          rating: 4.8,
          stock: 156,
          trend: 'up'
        },
        {
          id: '2',
          name: 'Basmati Rice 5kg',
          category: 'Staples',
          sales: 1923,
          revenue: 548055,
          rating: 4.6,
          stock: 45,
          trend: 'up'
        },
        {
          id: '3',
          name: 'iPhone Charger',
          category: 'Electronics',
          sales: 456,
          revenue: 729144,
          rating: 4.7,
          stock: 23,
          trend: 'down'
        },
        {
          id: '4',
          name: 'Organic Bananas 1kg',
          category: 'Fruits',
          sales: 3421,
          revenue: 222365,
          rating: 4.4,
          stock: 0,
          trend: 'stable'
        }
      ];

      const mockDeliveryMetrics: DeliveryMetrics[] = [
        { zone: 'Whitefield', avgTime: 16.2, orders: 2341, satisfaction: 4.7, efficiency: 94.2 },
        { zone: 'Koramangala', avgTime: 14.8, orders: 3156, satisfaction: 4.8, efficiency: 96.1 },
        { zone: 'HSR Layout', avgTime: 18.3, orders: 1987, satisfaction: 4.5, efficiency: 91.7 },
        { zone: 'Electronic City', avgTime: 21.5, orders: 1456, satisfaction: 4.3, efficiency: 88.9 },
        { zone: 'Indiranagar', avgTime: 15.9, orders: 2789, satisfaction: 4.6, efficiency: 93.8 }
      ];

      setStats(mockStats);
      setOrderData(mockOrderData);
      setProductPerformance(mockProductPerformance);
      setDeliveryMetrics(mockDeliveryMetrics);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const timeRanges = [
    { value: '24h', label: 'Last 24 Hours' },
    { value: '7d', label: 'Last 7 Days' },
    { value: '30d', label: 'Last 30 Days' },
    { value: '90d', label: 'Last 90 Days' }
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-IN').format(num);
  };

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Instamart Admin Dashboard</h1>
              <p className="text-gray-600 mt-1">Real-time insights and analytics</p>
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                {timeRanges.map(range => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
              <button
                onClick={loadDashboardData}
                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                title="Refresh"
              >
                <FiRefreshCw className="h-5 w-5" />
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2">
                <FiDownload className="h-4 w-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.totalOrders)}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <FiTrendingUp className="h-4 w-4" />
                  +12.5% vs last period
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FiShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <FiTrendingUp className="h-4 w-4" />
                  +18.2% vs last period
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <FiDollarSign className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">{formatNumber(stats.activeUsers)}</p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <FiTrendingUp className="h-4 w-4" />
                  +8.7% vs last period
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <FiUsers className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Delivery Time</p>
                <p className="text-3xl font-bold text-gray-900">{stats.avgDeliveryTime}<span className="text-lg">m</span></p>
                <p className="text-sm text-green-600 flex items-center gap-1 mt-1">
                  <FiTrendingDown className="h-4 w-4" />
                  -2.3m vs last period
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <FiTruck className="h-8 w-8 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Secondary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.completionRate}%</p>
              </div>
              <FiCheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Customer Satisfaction</p>
                <p className="text-2xl font-bold text-gray-900">{stats.customerSatisfaction}<span className="text-sm">/5</span></p>
              </div>
              <FiStar className="h-6 w-6 text-yellow-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Subscriptions</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.subscriptions)}</p>
              </div>
              <FiRefreshCw className="h-6 w-6 text-blue-600" />
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Carbon Saved (kg)</p>
                <p className="text-2xl font-bold text-gray-900">{formatNumber(stats.carbonSaved)}</p>
              </div>
              <div className="text-green-600">🌱</div>
            </div>
          </div>
        </div>

        {/* Charts and Analytics */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* Order Trends */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Order Trends</h3>
              <div className="flex items-center gap-2">
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded text-sm"
                >
                  <option value="orders">Orders</option>
                  <option value="revenue">Revenue</option>
                </select>
              </div>
            </div>
            <div className="h-64">
              {/* Simple chart representation */}
              <div className="flex items-end justify-between h-full gap-2">
                {orderData.map((data, index) => {
                  const maxValue = Math.max(...orderData.map(d => selectedMetric === 'orders' ? d.orders : d.revenue));
                  const height = selectedMetric === 'orders' 
                    ? (data.orders / maxValue) * 100 
                    : (data.revenue / maxValue) * 100;
                  
                  return (
                    <div key={index} className="flex flex-col items-center flex-1">
                      <div
                        className="bg-green-600 rounded-t w-full transition-all duration-300 hover:bg-green-700"
                        style={{ height: `${height}%` }}
                        title={`${data.time}: ${selectedMetric === 'orders' ? data.orders : formatCurrency(data.revenue)}`}
                      ></div>
                      <span className="text-xs text-gray-500 mt-2">{data.time}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Products</h3>
            <div className="space-y-4">
              {productPerformance.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-green-600">#{index + 1}</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{product.name}</div>
                      <div className="text-sm text-gray-600">{product.category} • {product.sales} sales</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-gray-900">{formatCurrency(product.revenue)}</div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-gray-600">★ {product.rating}</span>
                      {product.trend === 'up' && <FiTrendingUp className="h-3 w-3 text-green-600" />}
                      {product.trend === 'down' && <FiTrendingDown className="h-3 w-3 text-red-600" />}
                      {product.stock === 0 && <FiAlertCircle className="h-3 w-3 text-red-600" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Delivery Zones Performance */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">Delivery Zone Performance</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Zone</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Avg Delivery Time</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Total Orders</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Satisfaction</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Efficiency</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                </tr>
              </thead>
              <tbody>
                {deliveryMetrics.map((zone, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <FiMapPin className="h-4 w-4 text-gray-500" />
                        <span className="font-medium text-gray-900">{zone.zone}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FiClock className="h-4 w-4 text-gray-500" />
                        <span>{zone.avgTime}m</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">{formatNumber(zone.orders)}</td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1">
                        <FiStar className="h-4 w-4 text-yellow-500" />
                        <span>{zone.satisfaction}/5</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${zone.efficiency}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{zone.efficiency}%</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        zone.efficiency >= 95 
                          ? 'bg-green-100 text-green-700'
                          : zone.efficiency >= 90
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {zone.efficiency >= 95 ? 'Excellent' : zone.efficiency >= 90 ? 'Good' : 'Needs Attention'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FiPackage className="h-5 w-5 text-blue-600" />
                  <span>Manage Inventory</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FiUsers className="h-5 w-5 text-green-600" />
                  <span>User Management</span>
                </div>
              </button>
              <button className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <FiTruck className="h-5 w-5 text-orange-600" />
                  <span>Delivery Tracking</span>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Alerts & Notifications</h4>
            <div className="space-y-3">
              <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded">
                <div className="flex items-center gap-2">
                  <FiAlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-sm text-red-700">4 products out of stock</span>
                </div>
              </div>
              <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded">
                <div className="flex items-center gap-2">
                  <FiClock className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm text-yellow-700">Delivery delays in HSR Layout</span>
                </div>
              </div>
              <div className="p-3 bg-green-50 border-l-4 border-green-400 rounded">
                <div className="flex items-center gap-2">
                  <FiCheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-700">Daily target achieved</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h4 className="font-semibold text-gray-900 mb-4">Recent Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">New order #15847</div>
                  <div className="text-xs text-gray-500">2 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">New user registered</div>
                  <div className="text-xs text-gray-500">5 minutes ago</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-orange-600 rounded-full"></div>
                <div className="flex-1">
                  <div className="text-sm text-gray-900">Delivery completed</div>
                  <div className="text-xs text-gray-500">8 minutes ago</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
