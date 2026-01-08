import { Layout } from '@/components/layout/Layout';

export default function Privacidade() {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">Política de Privacidade</h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Introdução</h2>
            <p className="text-muted-foreground">
              Esta Política de Privacidade descreve como o KUIDD+ coleta, usa e
              protege as informações pessoais dos usuários. Ao utilizar nossa
              plataforma, você concorda com as práticas descritas neste documento.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              2. Informações Coletadas
            </h2>
            <p className="text-muted-foreground mb-4">
              <strong>Para Profissionais:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mb-4">
              <li>Nome completo, idade e sexo</li>
              <li>Informações de contato (email, WhatsApp)</li>
              <li>Localização (cidade e estado)</li>
              <li>Informações profissionais (formação, experiência, certificados)</li>
              <li>Fotos e vídeos de apresentação</li>
              <li>Valores de serviço</li>
            </ul>
            <p className="text-muted-foreground mb-4">
              <strong>Para Contratantes:</strong>
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                Não coletamos dados pessoais de contratantes, já que não é
                necessário cadastro para usar a plataforma
              </li>
              <li>
                Podemos coletar dados de navegação anônimos para melhorar a
                experiência
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Uso das Informações</h2>
            <p className="text-muted-foreground">
              As informações coletadas são utilizadas para:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Exibir perfis públicos dos profissionais</li>
              <li>Facilitar o contato entre contratantes e profissionais</li>
              <li>Processar verificações de antecedentes (quando aplicável)</li>
              <li>Enviar comunicações sobre a plataforma</li>
              <li>Melhorar nossos serviços</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              4. Compartilhamento de Dados
            </h2>
            <p className="text-muted-foreground">
              As informações dos perfis profissionais são públicas e visíveis para
              qualquer pessoa que acesse a plataforma. Não vendemos ou
              compartilhamos dados pessoais com terceiros para fins comerciais,
              exceto:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>
                Quando necessário para verificação de antecedentes (com parceiros
                autorizados)
              </li>
              <li>Quando exigido por lei ou ordem judicial</li>
              <li>
                Com prestadores de serviços essenciais (hospedagem, email, etc.)
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              5. Segurança dos Dados
            </h2>
            <p className="text-muted-foreground">
              Implementamos medidas de segurança técnicas e organizacionais para
              proteger suas informações, incluindo:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Criptografia de dados sensíveis</li>
              <li>Controle de acesso restrito</li>
              <li>Monitoramento de segurança</li>
              <li>Backups regulares</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Seus Direitos</h2>
            <p className="text-muted-foreground">
              De acordo com a LGPD (Lei Geral de Proteção de Dados), você tem
              direito a:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Acessar seus dados pessoais</li>
              <li>Corrigir informações incorretas</li>
              <li>Solicitar a exclusão de seus dados</li>
              <li>Revogar consentimentos</li>
              <li>Solicitar portabilidade dos dados</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Cookies</h2>
            <p className="text-muted-foreground">
              Utilizamos cookies e tecnologias similares para melhorar a
              experiência do usuário, manter sessões ativas e coletar dados de
              navegação anônimos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Contato</h2>
            <p className="text-muted-foreground">
              Para exercer seus direitos ou esclarecer dúvidas sobre esta
              política, entre em contato conosco através do email:
              Contato@kuiddmais.com.br
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              9. Alterações nesta Política
            </h2>
            <p className="text-muted-foreground">
              Esta política pode ser atualizada periodicamente. Recomendamos que
              você revise esta página regularmente. Alterações significativas
              serão comunicadas através da plataforma.
            </p>
          </section>

          <p className="text-sm text-muted-foreground pt-8 border-t">
            Última atualização: Janeiro de 2024
          </p>
        </div>
      </div>
    </Layout>
  );
}
