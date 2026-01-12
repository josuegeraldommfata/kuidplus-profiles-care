import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img src="/logo.png" alt="KUIDD+" className="h-16 md:h-24 lg:h-28 xl:h-32 w-auto object-contain" />
                <span className="text-lg font-bold"></span>
              </div>
            <p className="text-sm text-muted-foreground">
              KUIDD+, MAIS CONFIANÇA PARA ESCOLHER, MAIS OPORTUNIDADE PARA CUIDAR!!
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navegação</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/buscar" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Buscar Profissionais
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Sobre o KUID+
                </Link>
              </li>
              <li>
                <Link to="/cadastro" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Cadastre-se
                </Link>
              </li>
            </ul>
          </div>

          {/* Jurídico */}
          <div>
            <h4 className="font-semibold mb-4">Jurídico</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/termos-contratantes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termo de uso para familiares
                </Link>
              </li>
              <li>
                <Link to="/termos-profissionais" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termo de uso para profissionais
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                Contato@kuiddmais.com.br
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} KUIDD+. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
