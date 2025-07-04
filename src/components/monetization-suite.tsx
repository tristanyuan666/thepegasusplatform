"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  DollarSign,
  TrendingUp,
  Link,
  ShoppingBag,
  Target,
  Calendar,
  BarChart3,
  Zap,
  Gift,
  Users,
  Crown,
  Lock,
} from "lucide-react";
import { useSubscriptionCheck } from "@/components/subscription-check";

interface MonetizationSuiteProps {
  userProfile?: any;
  subscription?: any;
  className?: string;
}

interface EarningsData {
  total: number;
  thisMonth: number;
  lastMonth: number;
  growth: number;
}

interface AffiliateLink {
  id: string;
  name: string;
  url: string;
  clicks: number;
  conversions: number;
  earnings: number;
  isActive: boolean;
}

interface ProductLink {
  id: string;
  name: string;
  price: number;
  sales: number;
  revenue: number;
  isActive: boolean;
}

export default function MonetizationSuite({
  userProfile,
  subscription,
  className = "",
}: MonetizationSuiteProps) {
  const { checkFeatureAccess } = useSubscriptionCheck();
  const [earnings, setEarnings] = useState<EarningsData>({
    total: 2847.5,
    thisMonth: 1250.0,
    lastMonth: 980.0,
    growth: 27.5,
  });

  const [affiliateLinks, setAffiliateLinks] = useState<AffiliateLink[]>([
    {
      id: "1",
      name: "Camera Equipment",
      url: "https://amazon.com/camera-gear",
      clicks: 245,
      conversions: 12,
      earnings: 340.5,
      isActive: true,
    },
    {
      id: "2",
      name: "Editing Software",
      url: "https://adobe.com/premiere",
      clicks: 189,
      conversions: 8,
      earnings: 280.0,
      isActive: true,
    },
  ]);

  const [productLinks, setProductLinks] = useState<ProductLink[]>([
    {
      id: "1",
      name: "Content Creation Course",
      price: 97.0,
      sales: 23,
      revenue: 2231.0,
      isActive: true,
    },
    {
      id: "2",
      name: "Preset Pack",
      price: 29.99,
      sales: 45,
      revenue: 1349.55,
      isActive: true,
    },
  ]);

  const [newAffiliateLink, setNewAffiliateLink] = useState({
    name: "",
    url: "",
  });
  const [newProductLink, setNewProductLink] = useState({ name: "", price: "" });

  const hasMonetizationAccess = checkFeatureAccess(
    "monetization_suite",
    subscription,
  );
  const hasAdvancedFeatures = checkFeatureAccess(
    "advanced_analytics",
    subscription,
  );

  const addAffiliateLink = () => {
    if (newAffiliateLink.name && newAffiliateLink.url) {
      const newLink: AffiliateLink = {
        id: Date.now().toString(),
        name: newAffiliateLink.name,
        url: newAffiliateLink.url,
        clicks: 0,
        conversions: 0,
        earnings: 0,
        isActive: true,
      };
      setAffiliateLinks([...affiliateLinks, newLink]);
      setNewAffiliateLink({ name: "", url: "" });
    }
  };

  const addProductLink = () => {
    if (newProductLink.name && newProductLink.price) {
      const newProduct: ProductLink = {
        id: Date.now().toString(),
        name: newProductLink.name,
        price: parseFloat(newProductLink.price),
        sales: 0,
        revenue: 0,
        isActive: true,
      };
      setProductLinks([...productLinks, newProduct]);
      setNewProductLink({ name: "", price: "" });
    }
  };

  const toggleAffiliateLink = (id: string) => {
    setAffiliateLinks((links) =>
      links.map((link) =>
        link.id === id ? { ...link, isActive: !link.isActive } : link,
      ),
    );
  };

  const toggleProductLink = (id: string) => {
    setProductLinks((products) =>
      products.map((product) =>
        product.id === id
          ? { ...product, isActive: !product.isActive }
          : product,
      ),
    );
  };

  if (!hasMonetizationAccess) {
    return (
      <div className={`bg-background ${className}`}>
        <Card className="border-2 border-dashed border-muted-foreground/25">
          <CardHeader className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Lock className="w-8 h-8 text-muted-foreground" />
            </div>
            <CardTitle className="text-2xl mb-2">Monetization Suite</CardTitle>
            <CardDescription className="text-lg mb-6">
              Unlock powerful monetization tools to maximize your earnings
            </CardDescription>
            <div className="space-y-2 text-sm text-muted-foreground mb-6">
              <div className="flex items-center justify-center gap-2">
                <DollarSign className="w-4 h-4" />
                <span>Affiliate link management</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <ShoppingBag className="w-4 h-4" />
                <span>Product sales tracking</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="w-4 h-4" />
                <span>Revenue analytics</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Target className="w-4 h-4" />
                <span>Earning optimization</span>
              </div>
            </div>
            <Button
              size="lg"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
            >
              <Crown className="w-4 h-4 mr-2" />
              Upgrade to Access
            </Button>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className={`bg-background space-y-6 ${className}`}>
      {/* Earnings Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Earnings
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earnings.total.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">All time revenue</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${earnings.thisMonth.toLocaleString()}
            </div>
            <p className="text-xs text-green-600">
              +{earnings.growth}% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Affiliate Revenue
            </CardTitle>
            <Link className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {affiliateLinks
                .reduce((sum, link) => sum + link.earnings, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {affiliateLinks.filter((link) => link.isActive).length} active
              links
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Product Sales</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              $
              {productLinks
                .reduce((sum, product) => sum + product.revenue, 0)
                .toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {productLinks.reduce((sum, product) => sum + product.sales, 0)}{" "}
              total sales
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="affiliate" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="affiliate">Affiliate Links</TabsTrigger>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="optimization">Optimization</TabsTrigger>
        </TabsList>

        {/* Affiliate Links Tab */}
        <TabsContent value="affiliate" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Affiliate Link Management</CardTitle>
              <CardDescription>
                Track and manage your affiliate marketing links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Affiliate Link */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="affiliate-name">Link Name</Label>
                  <Input
                    id="affiliate-name"
                    placeholder="e.g., Camera Equipment"
                    value={newAffiliateLink.name}
                    onChange={(e) =>
                      setNewAffiliateLink({
                        ...newAffiliateLink,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="affiliate-url">Affiliate URL</Label>
                  <Input
                    id="affiliate-url"
                    placeholder="https://..."
                    value={newAffiliateLink.url}
                    onChange={(e) =>
                      setNewAffiliateLink({
                        ...newAffiliateLink,
                        url: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addAffiliateLink} className="w-full">
                    <Link className="w-4 h-4 mr-2" />
                    Add Link
                  </Button>
                </div>
              </div>

              {/* Affiliate Links List */}
              <div className="space-y-3">
                {affiliateLinks.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{link.name}</h4>
                        <Badge
                          variant={link.isActive ? "default" : "secondary"}
                        >
                          {link.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {link.url}
                      </p>
                      <div className="flex gap-4 text-sm">
                        <span>
                          <strong>{link.clicks}</strong> clicks
                        </span>
                        <span>
                          <strong>{link.conversions}</strong> conversions
                        </span>
                        <span className="text-green-600">
                          <strong>${link.earnings}</strong> earned
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={link.isActive}
                        onCheckedChange={() => toggleAffiliateLink(link.id)}
                      />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Products Tab */}
        <TabsContent value="products" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Product Sales Tracking</CardTitle>
              <CardDescription>
                Monitor your digital product sales and revenue
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add New Product */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor="product-name">Product Name</Label>
                  <Input
                    id="product-name"
                    placeholder="e.g., Content Course"
                    value={newProductLink.name}
                    onChange={(e) =>
                      setNewProductLink({
                        ...newProductLink,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product-price">Price ($)</Label>
                  <Input
                    id="product-price"
                    type="number"
                    placeholder="97.00"
                    value={newProductLink.price}
                    onChange={(e) =>
                      setNewProductLink({
                        ...newProductLink,
                        price: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={addProductLink} className="w-full">
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </div>
              </div>

              {/* Products List */}
              <div className="space-y-3">
                {productLinks.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-medium">{product.name}</h4>
                        <Badge
                          variant={product.isActive ? "default" : "secondary"}
                        >
                          {product.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <div className="flex gap-4 text-sm mb-2">
                        <span>
                          <strong>${product.price}</strong> price
                        </span>
                        <span>
                          <strong>{product.sales}</strong> sales
                        </span>
                        <span className="text-green-600">
                          <strong>${product.revenue}</strong> revenue
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min((product.sales / 50) * 100, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={product.isActive}
                        onCheckedChange={() => toggleProductLink(product.id)}
                      />
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Trends</CardTitle>
                <CardDescription>Monthly earnings over time</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">January</span>
                    <span className="font-medium">$890</span>
                  </div>
                  <Progress value={65} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">February</span>
                    <span className="font-medium">$1,120</span>
                  </div>
                  <Progress value={80} className="h-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-sm">March</span>
                    <span className="font-medium">$1,250</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Performers</CardTitle>
                <CardDescription>Best earning sources</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">Content Course</span>
                    </div>
                    <span className="font-medium text-green-600">$2,231</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4 text-purple-500" />
                      <span className="text-sm">Preset Pack</span>
                    </div>
                    <span className="font-medium text-green-600">$1,350</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Link className="w-4 h-4 text-orange-500" />
                      <span className="text-sm">Camera Equipment</span>
                    </div>
                    <span className="font-medium text-green-600">$341</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {hasAdvancedFeatures && (
            <Card>
              <CardHeader>
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>Detailed performance insights</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">4.2%</div>
                    <div className="text-sm text-muted-foreground">
                      Conversion Rate
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-green-600">
                      $45.30
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg. Order Value
                    </div>
                  </div>
                  <div className="text-center p-4 border rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">
                      12.8%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Return Rate
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Optimization Tab */}
        <TabsContent value="optimization" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Earning Opportunities</CardTitle>
                <CardDescription>
                  AI-powered suggestions to boost revenue
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Alert>
                  <Zap className="h-4 w-4" />
                  <AlertDescription>
                    <strong>High-converting content detected!</strong> Your
                    tutorial videos have 3x higher affiliate click rates.
                    Consider creating more educational content.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Target className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Pricing optimization:</strong> Similar creators
                    charge $127 for courses like yours. Consider testing a
                    higher price point.
                  </AlertDescription>
                </Alert>

                <Alert>
                  <Gift className="h-4 w-4" />
                  <AlertDescription>
                    <strong>Bundle opportunity:</strong> 78% of your course
                    buyers also purchase presets. Create a bundle to increase
                    AOV.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Revenue Goals</CardTitle>
                <CardDescription>Track your earning targets</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Monthly Goal</span>
                    <span>$1,250 / $2,000</span>
                  </div>
                  <Progress value={62.5} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    62.5% complete • $750 to go
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Yearly Goal</span>
                    <span>$2,847 / $25,000</span>
                  </div>
                  <Progress value={11.4} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    11.4% complete • $22,153 to go
                  </p>
                </div>

                <Button className="w-full mt-4" variant="outline">
                  <Target className="w-4 h-4 mr-2" />
                  Update Goals
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
