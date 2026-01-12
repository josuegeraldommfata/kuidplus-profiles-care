import { Layout } from '@/components/layout/Layout';

export default function TermosContratantes() {
  return (
    <Layout>
      <div className="container py-12 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8">
          Termos de Uso — Contratantes
        </h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Sobre a Plataforma</h2>
            <p className="text-muted-foreground">
              O KUIDD+ é uma plataforma de exibição de perfis de profissionais de
              saúde. Ao utilizar a plataforma, você concorda que o KUIDD+ serve
              exclusivamente para facilitar o contato entre contratantes e
              profissionais.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              2. O que o KUIDD+ NÃO faz
            </h2>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2">
              <li>
                <strong>Não intermedia a contratação</strong> — A negociação e
                contratação são feitas diretamente entre você e o profissional
              </li>
              <li>
                <strong>Não processa pagamentos</strong> — Valores são acordados
                e pagos diretamente ao profissional
              </li>
              <li>
                <strong>Não se responsabiliza pelos atendimentos</strong> — A
                qualidade e execução do serviço são de responsabilidade exclusiva
                do profissional
              </li>
              <li>
                <strong>Não estabelece vínculo empregatício</strong> — Não existe
                qualquer vínculo trabalhista com o KUIDD+
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              3. Uso da Plataforma
            </h2>
            <p className="text-muted-foreground mb-4">
              Para buscar profissionais no KUIDD+, você não precisa criar conta.
              Basta utilizar os filtros de busca e entrar em contato diretamente
              via WhatsApp.
            </p>
            <p className="text-muted-foreground">
              Recomendamos que você:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Verifique as credenciais do profissional</li>
              <li>Solicite referências quando necessário</li>
              <li>Alinhe expectativas, valores e condições antes da contratação</li>
              <li>Formalize acordos por escrito quando apropriado</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              4. Aviso sobre Verificação
            </h2>
            <p className="text-muted-foreground">
              Embora o KUIDD+ possa indicar que um profissional possui
              "antecedentes verificados", esta verificação é informativa e não
              constitui garantia de conduta. A decisão de contratar e a
              verificação adicional de credenciais são de sua responsabilidade.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Avaliações</h2>
            <p className="text-muted-foreground">
              Após utilizar os serviços de um profissional encontrado através do
              KUIDD+, você poderá avaliá-lo com uma nota de 1 a 5 estrelas. As
              avaliações ajudam outros contratantes e devem refletir sua
              experiência real.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              6. Limitação de Responsabilidade
            </h2>
            <p className="text-muted-foreground">
              O KUIDD+ não se responsabiliza por:
            </p>
            <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
              <li>Qualidade dos serviços prestados pelos profissionais</li>
              <li>Veracidade das informações fornecidas nos perfis</li>
              <li>Danos materiais ou morais decorrentes da contratação</li>
              <li>Disputas entre contratantes e profissionais</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">
              7. Alterações nos Termos
            </h2>
            <p className="text-muted-foreground">
              Estes termos podem ser alterados a qualquer momento. Recomendamos
              que você revise periodicamente esta página.
            </p>
          </section>

          <p className="text-sm text-muted-foreground pt-8 border-t">
            Última atualização: Janeiro de 2026
          </p>
        </div>
      </div>
    </Layout>
  );
}
