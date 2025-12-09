import { Calendar, User, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { SEO } from '@/components/SEO';
import { toast } from 'sonner';

const blogPosts = [
  {
    id: 1,
    title: 'Understanding Commercial Real Estate Investment Returns',
    excerpt: 'Learn about the key metrics and factors that determine returns in commercial real estate investments.',
    author: 'Sarah Johnson',
    date: 'November 15, 2025',
    category: 'Investment Strategy',
    image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80',
    readTime: '5 min read',
  },
  {
    id: 2,
    title: 'The Rise of Mixed-Use Developments',
    excerpt: 'Exploring how mixed-use properties are reshaping urban landscapes and creating new investment opportunities.',
    author: 'Michael Chen',
    date: 'November 10, 2025',
    category: 'Market Trends',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80',
    readTime: '7 min read',
  },
  {
    id: 3,
    title: 'Tax Benefits of Commercial Real Estate Investing',
    excerpt: 'A comprehensive guide to understanding tax advantages and deductions available to CRE investors.',
    author: 'Emily Rodriguez',
    date: 'November 5, 2025',
    category: 'Tax & Legal',
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
    readTime: '6 min read',
  },
  {
    id: 4,
    title: 'Due Diligence Checklist for Property Investors',
    excerpt: 'Essential steps and considerations when evaluating commercial properties for investment.',
    author: 'David Park',
    date: 'October 28, 2025',
    category: 'Investment Strategy',
    image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&q=80',
    readTime: '8 min read',
  },
  {
    id: 5,
    title: 'How Technology is Transforming Real Estate',
    excerpt: 'Discover how PropTech innovations are making commercial real estate more accessible and efficient.',
    author: 'Lisa Thompson',
    date: 'October 20, 2025',
    category: 'Technology',
    image: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=800&q=80',
    readTime: '5 min read',
  },
  {
    id: 6,
    title: 'Diversification Strategies for Real Estate Portfolios',
    excerpt: 'Learn how to build a balanced commercial real estate portfolio across different property types and markets.',
    author: 'James Wilson',
    date: 'October 15, 2025',
    category: 'Portfolio Management',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80',
    readTime: '6 min read',
  },
];

const categories = ['All', 'Investment Strategy', 'Market Trends', 'Tax & Legal', 'Technology', 'Portfolio Management'];

export default function BlogPage() {
  const handleReadMore = (postId: number, postTitle: string) => {
    toast.info('Blog Post Coming Soon', {
      description: `"${postTitle}" - Full blog post functionality will be available soon!`,
    });
  };

  return (
    <>
      <SEO
        title="Blog - Real Estate Investment Insights | Big Partner"
        description="Expert insights, strategies, and news about commercial real estate investment. Learn from industry professionals about property investment, market trends, and portfolio management."
        keywords="real estate blog, investment insights, property investment tips, commercial real estate news, CRE strategies, market trends, investment education"
        canonical="https://bigpartner.in/blog"
      />
      <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 via-background to-accent/10 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Big Partner Blog</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Insights, strategies, and news about commercial real estate investment
            </p>
            <div className="max-w-md mx-auto">
              <div className="flex gap-2">
                <Input placeholder="Search articles..." className="flex-1" />
                <Button>Search</Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-8 border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Badge
                key={category}
                variant={category === 'All' ? 'default' : 'outline'}
                className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                {category}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Featured Article</h2>
            <Card className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="grid md:grid-cols-2 gap-0">
                <div className="relative h-64 md:h-auto">
                  <img
                    src={blogPosts[0].image}
                    alt={blogPosts[0].title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader className="flex flex-col justify-center">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                    <Badge>{blogPosts[0].category}</Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {blogPosts[0].date}
                    </span>
                    <span>{blogPosts[0].readTime}</span>
                  </div>
                  <CardTitle className="text-2xl mb-4">{blogPosts[0].title}</CardTitle>
                  <CardDescription className="text-base mb-6">{blogPosts[0].excerpt}</CardDescription>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm">
                      <User className="h-4 w-4" />
                      <span>{blogPosts[0].author}</span>
                    </div>
                    <Button onClick={() => handleReadMore(blogPosts[0].id, blogPosts[0].title)}>
                      Read More
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Posts */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8">Recent Articles</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogPosts.slice(1).map((post) => (
                <Card key={post.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col">
                  <div className="relative h-48">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardHeader className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                      <Badge variant="secondary" className="text-xs">{post.category}</Badge>
                      <span>{post.readTime}</span>
                    </div>
                    <CardTitle className="text-lg mb-2 line-clamp-2">{post.title}</CardTitle>
                    <CardDescription className="line-clamp-3">{post.excerpt}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="h-4 w-4" />
                        <span>{post.author}</span>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => handleReadMore(post.id, post.title)}>
                        Read
                        <ArrowRight className="ml-1 h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-muted-foreground mb-8">
              Subscribe to our newsletter for the latest insights and investment opportunities
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input placeholder="Enter your email" type="email" className="flex-1" />
              <Button>Subscribe</Button>
            </div>
          </div>
        </div>
      </section>
    </div>
    </>
  );
}
