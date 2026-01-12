import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '@/contexts/AuthContext';

export default function MercadoPagoKeys() {
  const { user } = useAuth();
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [status, setStatus] = useState<string | null>(null);

  const save = async () => {
    try {
      const res = await axios.post('/api/mercadopago/save_keys', {
        userId: user?.id || null,
        provider: 'mercadopago',
        public_key: publicKey,
        private_key: privateKey,
      });
      setStatus('Chaves salvas com sucesso.');
    } catch (err) {
      setStatus('Erro ao salvar chaves.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">Configurar Mercado Pago</h1>
      <div className="max-w-lg">
        <label className="block">Public Key (Client ID)</label>
        <input className="w-full border p-2 mb-2" value={publicKey} onChange={(e) => setPublicKey(e.target.value)} />
        <label className="block">Private Key (Access Token)</label>
        <input className="w-full border p-2 mb-2" value={privateKey} onChange={(e) => setPrivateKey(e.target.value)} />
        <button className="btn mt-2" onClick={save}>Salvar chaves</button>
        {status && <p className="mt-2">{status}</p>}
      </div>
    </div>
  );
}
