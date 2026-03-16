import React from 'react';

export default function DashboardAdmin() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 tracking-tight">
            Dashboard Admin
          </h1>
          <p className="text-xl text-gray-600 mt-2">
            Visão geral da plataforma KuidPlus
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
            Nova Ação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-8 rounded-2xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-2xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-blue-100 text-sm font-medium uppercase tracking-wide">Total Usuários</p>
              <p className="text-4xl font-bold mt-1">1.247</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 rounded-2xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-2xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-emerald-100 text-sm font-medium uppercase tracking-wide">Profissionais</p>
              <p className="text-4xl font-bold mt-1">289</p>
              <p className="text-emerald-200 text-sm mt-1">+12 esta semana</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-8 rounded-2xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-2xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-purple-100 text-sm font-medium uppercase tracking-wide">Contratos</p>
              <p className="text-4xl font-bold mt-1">73</p>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-8 rounded-2xl text-white shadow-2xl hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center">
            <div className="p-3 bg-white/20 rounded-2xl">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-6">
              <p className="text-orange-100 text-sm font-medium uppercase tracking-wide">Receita</p>
              <p className="text-4xl font-bold mt-1">R$ 47.820</p>
              <p className="text-orange-200 text-sm mt-1">+28% M/M</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Contratos Recentes</h2>
              <button className="text-indigo-600 hover:text-indigo-700 font-medium text-sm">Ver todos →</button>
            </div>
            <div className="space-y-4">
              <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-semibold text-sm">ENF</span>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">Maria Silva - Enfermeira</p>
                  <p className="text-sm text-gray-600">João Contratante • Hospital Albert Einstein</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600 text-lg">R$ 2.800</p>
                  <span className="text-xs text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">Ativo</span>
                </div>
              </div>
              <div className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold text-sm">TEC</span>
                </div>
                <div className="ml-4 flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">Pedro Santos - Técnico</p>
                  <p className="text-sm text-gray-600">Família Souza • Home Care</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-600 text-lg">R$ 1.950</p>
                  <span className="text-xs text-orange-600 font-medium bg-orange-100 px-2 py-1 rounded-full">Pendente</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Avaliação Geral</h2>
            <div className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-black text-yellow-400 mb-2">4.8</div>
                <div className="text-sm text-gray-500">/ 5.0</div>
                <div className="flex justify-center space-x-1 mt-4">
                  {[1,2,3,4,5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-emerald-600 mb-2">2.847</div>
                <p className="text-sm text-gray-600">Avaliações totais</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

