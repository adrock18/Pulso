import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { api } from '@/services/api';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

/**
 * AdminTrendsPage — admin-only page showing product review trends.
 *
 * Fetches from GET /api/analytics/trends (requires admin auth).
 * Displays a table with each product's total reviews, recent reviews,
 * average ratings, and trend indicators.
 */
export default function AdminTrendsPage() {
  const { user, loading: authLoading, isAdmin } = useAuth();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAdmin) return;

    api
      .get('/analytics/trends')
      .then((data) => setTrends(data))
      .catch((err) => setError(err.message || 'Failed to load trends'))
      .finally(() => setLoading(false));
  }, [authLoading, isAdmin]);

  // Wait for auth to resolve
  if (authLoading) {
    return (
      <div className="text-sm text-muted-foreground py-12 text-center">
        Loading...
      </div>
    );
  }

  // Redirect non-admin users
  if (!user || !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Product Trends</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Review activity and rating trends across all products
        </p>
      </div>

      {loading && (
        <div className="text-sm text-muted-foreground py-8 text-center">
          Loading trends...
        </div>
      )}

      {error && (
        <div className="text-sm text-destructive py-8 text-center">{error}</div>
      )}

      {!loading && !error && trends.length === 0 && (
        <div className="text-sm text-muted-foreground py-8 text-center">
          No products found.
        </div>
      )}

      {!loading && !error && trends.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">
              All Products ({trends.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead className="text-center">Total Reviews</TableHead>
                  <TableHead className="text-center">Recent (30d)</TableHead>
                  <TableHead className="text-center">Avg Rating</TableHead>
                  <TableHead className="text-center">Recent Avg</TableHead>
                  <TableHead className="text-center">Trend</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {trends.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Link
                        to={`/products/${item.id}`}
                        className="text-sm font-medium hover:text-primary transition-colors"
                      >
                        {item.name}
                      </Link>
                      <span className="block text-xs text-muted-foreground">
                        {item.model}
                      </span>
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.totalReviews}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.recentReviews}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.avgRating > 0 ? item.avgRating.toFixed(1) : '--'}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {item.recentAvgRating !== null
                        ? item.recentAvgRating.toFixed(1)
                        : '--'}
                    </TableCell>
                    <TableCell className="text-center">
                      <TrendBadge trend={item.trend} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * TrendBadge — displays an up/down/stable indicator with appropriate styling.
 */
function TrendBadge({ trend }) {
  if (trend === 'up') {
    return (
      <Badge variant="outline" className="text-xs text-emerald-600 border-emerald-200">
        <span className="mr-0.5" aria-hidden="true">&#8593;</span> Up
      </Badge>
    );
  }
  if (trend === 'down') {
    return (
      <Badge variant="outline" className="text-xs text-red-600 border-red-200">
        <span className="mr-0.5" aria-hidden="true">&#8595;</span> Down
      </Badge>
    );
  }
  return (
    <Badge variant="outline" className="text-xs text-muted-foreground">
      <span className="mr-0.5" aria-hidden="true">&#8212;</span> Stable
    </Badge>
  );
}
