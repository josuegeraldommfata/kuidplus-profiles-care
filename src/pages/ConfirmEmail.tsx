import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Layout } from '@/components/layout/Layout';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function ConfirmEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Token de confirmação não encontrado.');
      return;
    }

    const confirmEmail = async () => {
      try {
        const response = await fetch('/api/auth/confirm-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token }),
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Email confirmado com sucesso! Você pode agora fazer login.');
          toast({
            title: 'Sucesso!',
            description: 'Seu email foi confirmado.',
          });
        } else {
          setStatus('error');
          setMessage(data.error || 'Erro ao confirmar email.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Erro de conexão. Tente novamente.');
      }
    };

    confirmEmail();
  }, [token, toast]);

  return (
    <Layout hideFooter>
      <div className="min-h-[calc(100vh-4rem)] py-8 px-4 gradient-hero">
        <div className="container max-w-md">
          <Card className="animate-fade-in shadow-lg">
            <CardHeader className="text-center">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mx-auto mb-4">
                {status === 'loading' && <Loader2 className="w-6 h-6 animate-spin text-primary-foreground" />}
                {status === 'success' && <CheckCircle className="w-6 h-6 text-green-600" />}
                {status === 'error' && <XCircle className="w-6 h-6 text-red-600" />}
              </div>
              <CardTitle>
                {status === 'loading' && 'Confirmando Email...'}
                {status === 'success' && 'Email Confirmado!'}
                {status === 'error' && 'Erro na Confirmação'}
              </CardTitle>
              <CardDescription>{message}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              {status === 'success' && (
                <Button onClick={() => navigate('/login')} className="w-full">
                  Ir para Login
                </Button>
              )}
              {status === 'error' && (
                <div className="space-y-3">
                  <Button onClick={() => navigate('/login')} variant="outline" className="w-full">
                    Ir para Login
                  </Button>
                  <Button onClick={() => navigate('/cadastro')} className="w-full">
                    Novo Cadastro
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
