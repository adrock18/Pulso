import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { api } from '@/services/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

/**
 * ProductAnalytics — displays rating distribution, aspect averages,
 * and verified/unverified counts for a single product.
 *
 * Fetches data from GET /api/analytics/products/:productId.
 * Designed to be embedded in ProductDetailPage.
 *
 * @param {{ productId: string }} props
 */
export default function ProductAnalytics({ productId }) {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!productId) return;

    setLoading(true);
    setError(null);

    api
      .get(`/analytics/products/${productId}`)
      .then((data) => setAnalytics(data))
      .catch((err) => setError(err.message || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        Loading analytics...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive py-4">{error}</div>
    );
  }

  if (!analytics || analytics.totalReviews === 0) {
    return (
      <div className="text-sm text-muted-foreground py-4">
        No reviews yet. Be the first to review this product.
      </div>
    );
  }

  // Prepare rating distribution data for Recharts
  const distributionData = [5, 4, 3, 2, 1].map((star) => ({
    name: `${star} star`,
    count: analytics.distribution[star] || 0,
  }));

  // Prepare aspect averages data (only non-null aspects)
  const aspectLabels = {
    battery: 'Battery',
    build: 'Build Quality',
    easeOfUse: 'Ease of Use',
    performance: 'Performance',
    value: 'Value for Money',
  };

  const aspectData = Object.entries(analytics.aspectAverages)
    .filter(([, value]) => value !== null)
    .map(([key, value]) => ({
      name: aspectLabels[key] || key,
      average: value,
    }));

  return (
    <div className="space-y-6">
      {/* Review count badges */}
      <div className="flex flex-wrap gap-2">
        <Badge variant="secondary" className="text-xs">
          {analytics.totalReviews} review{analytics.totalReviews !== 1 ? 's' : ''}
        </Badge>
        <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">
          {analytics.verifiedCount} verified
        </Badge>
        <Badge variant="outline" className="text-xs text-muted-foreground">
          {analytics.unverifiedCount} unverified
        </Badge>
      </div>

      {/* Rating Distribution */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Rating Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart
              data={distributionData}
              layout="vertical"
              margin={{ top: 0, right: 20, bottom: 0, left: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                allowDecimals={false}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                type="category"
                dataKey="name"
                tick={{ fontSize: 12 }}
                width={50}
              />
              <Tooltip
                formatter={(value) => [value, 'Reviews']}
                contentStyle={{ fontSize: 12 }}
              />
              <Bar
                dataKey="count"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
                maxBarSize={20}
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Aspect Averages */}
      {aspectData.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Aspect Ratings</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={aspectData.length * 40 + 20}>
              <BarChart
                data={aspectData}
                layout="vertical"
                margin={{ top: 0, right: 20, bottom: 0, left: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis
                  type="number"
                  domain={[0, 5]}
                  ticks={[0, 1, 2, 3, 4, 5]}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  width={100}
                />
                <Tooltip
                  formatter={(value) => [value.toFixed(2), 'Avg Rating']}
                  contentStyle={{ fontSize: 12 }}
                />
                <Bar
                  dataKey="average"
                  fill="hsl(var(--primary) / 0.8)"
                  radius={[0, 4, 4, 0]}
                  maxBarSize={20}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
