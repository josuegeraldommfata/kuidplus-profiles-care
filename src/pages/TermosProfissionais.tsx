import { Layout } from '@/components/layout/Layout';

export default function TermosProfissionais() {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">
          Termos de Uso — Profissionais
        </h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Sobre a Plataforma</h2>
            <p className="text-muted-foreground">
              O KUID+ é uma plataforma de exibição de perfis profissionais de
              saúde. Ao se cadastrar, você concorda que o KUID+ funciona
              exclusivamente como um espaço para divulgação do seu perfil,
              facilitando o contato direto entre você e potenciais contratantes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              2. O que o KUID+ NÃO faz
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Não intermedia a contratação de serviços</li>
              <li>Não processa pagamentos</li>
              <li>Não é responsável pelos atendimentos realizados</li>
              <li>Não estabelece vínculo empregatício entre as partes</li>
              <li>Não garante a contratação de seus serviços</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              3. Responsabilidades do Profissional
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Fornecer informações verdadeiras e atualizadas</li>
              <li>
                Manter documentação profissional válida (COREN, certificados, etc.)
              </li>
              <li>
                Responder aos contatos de forma profissional e respeitosa
              </li>
              <li>
                Negociar valores e condições diretamente com o contratante
              </li>
              <li>
                Cumprir com as obrigações legais e tributárias de sua atividade
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Cadastro e Perfil</h2>
            <p className="text-muted-foreground mb-4">
              Ao criar um perfil no KUID+, você autoriza a exibição pública das
              informações fornecidas, incluindo:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>Nome e foto de perfil</li>
              <li>Profissão e experiência</li>
              <li>Formações e certificados</li>
              <li>Área de atendimento e valores</li>
              <li>Informações de contato (WhatsApp)</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              5. Verificação de Antecedentes
            </h2>
            <p className="text-muted-foreground">
              O KUID+ pode solicitar documentação para verificação de antecedentes
              criminais. Esta verificação é um diferencial de segurança, mas não
              constitui garantia de conduta. A verificação é feita por parceiros
              terceirizados e o KUID+ não se responsabiliza por eventuais falhas
              no processo.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Planos e Pagamentos</h2>
            <p className="text-muted-foreground">
              O KUID+ oferece planos de assinatura para profissionais. Os valores
              e benefícios de cada plano estão disponíveis na plataforma. O
              pagamento da assinatura não garante contratação de serviços por
              parte dos contratantes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              7. Suspensão e Exclusão
            </h2>
            <p className="text-muted-foreground">
              O KUID+ reserva o direito de suspender ou excluir perfis que
              violem estes termos, apresentem informações falsas, ou recebam
              denúncias de má conduta.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Avaliações</h2>
            <p className="text-muted-foreground">
              Os contratantes podem avaliar os profissionais com notas de 1 a 5
              estrelas. As avaliações são públicas e refletem a opinião dos
              contratantes. O KUID+ não interfere nas avaliações, mas pode
              remover avaliações que violem nossas diretrizes.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              9. Alterações nos Termos
            </h2>
            <p className="text-muted-foreground">
              Estes termos podem ser alterados a qualquer momento. As alterações
              serão comunicadas por email e/ou através da plataforma. O uso
              continuado após as alterações implica aceitação dos novos termos.
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
