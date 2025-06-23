import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Navigate } from 'react-router-dom';

const Auth: React.FC = () => {
  const { signIn, signUp, user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  // Form states
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    email: '', 
    password: '', 
    fullName: '',
    confirmPassword: '' 
  });

  // Redirect if already authenticated
  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    const { error } = await signIn(signInData.email, signInData.password);
    
    if (error) {
      toast.error(`Login gagal: ${error.message}`);
    } else {
      toast.success('Berhasil login!');
    }
    
    setIsLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (signUpData.password !== signUpData.confirmPassword) {
      toast.error('Password tidak cocok!');
      return;
    }
    
    if (signUpData.password.length < 6) {
      toast.error('Password minimal 6 karakter!');
      return;
    }
    
    setIsLoading(true);
    
    const { error } = await signUp(signUpData.email, signUpData.password, signUpData.fullName);
    
    if (error) {
      toast.error(`Daftar gagal: ${error.message}`);
    } else {
      toast.success('Berhasil daftar! Silakan cek email untuk konfirmasi.');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-lifeguide-cream to-lifeguide-light-blue flex items-center justify-center p-4">
      <Card className="w-full max-w-md lifeguide-shadow">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-lifeguide-blue">
            Welcome to LifeGuide
          </CardTitle>
          <p className="text-muted-foreground">
            Panduan hidup untuk remaja Indonesia
          </p>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Masuk</TabsTrigger>
              <TabsTrigger value="signup">Daftar</TabsTrigger>
            </TabsList>
            
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signin-email">Email</Label>
                  <Input
                    id="signin-email"
                    type="email"
                    value={signInData.email}
                    onChange={(e) => setSignInData(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signin-password">Password</Label>
                  <Input
                    id="signin-password"
                    type="password"
                    value={signInData.password}
                    onChange={(e) => setSignInData(prev => ({...prev, password: e.target.value}))}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-lifeguide-blue hover:bg-lifeguide-teal"
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Masuk'}
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Nama Lengkap</Label>
                  <Input
                    id="signup-name"
                    type="text"
                    value={signUpData.fullName}
                    onChange={(e) => setSignUpData(prev => ({...prev, fullName: e.target.value}))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input
                    id="signup-email"
                    type="email"
                    value={signUpData.email}
                    onChange={(e) => setSignUpData(prev => ({...prev, email: e.target.value}))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input
                    id="signup-password"
                    type="password"
                    value={signUpData.password}
                    onChange={(e) => setSignUpData(prev => ({...prev, password: e.target.value}))}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm">Konfirmasi Password</Label>
                  <Input
                    id="signup-confirm"
                    type="password"
                    value={signUpData.confirmPassword}
                    onChange={(e) => setSignUpData(prev => ({...prev, confirmPassword: e.target.value}))}
                    required
                  />
                </div>
                <Button 
                  type="submit" 
                  className="w-full bg-lifeguide-blue hover:bg-lifeguide-teal"
                  disabled={isLoading}
                >
                  {isLoading ? 'Memproses...' : 'Daftar'}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default Auth;