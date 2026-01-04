import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-primary">
                <span className="text-sm font-bold text-primary-foreground">K+</span>
              </div>
              <span className="text-lg font-bold">KUID+</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Conectando famílias a cuidadores de saúde qualificados.
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

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/termos-profissionais" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termos para Profissionais
                </Link>
              </li>
              <li>
                <Link to="/termos-contratantes" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Termos para Contratantes
                </Link>
              </li>
              <li>
                <Link to="/privacidade" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Política de Privacidade
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contato</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">
                contato@kuidplus.com.br
              </li>
              <li className="text-sm text-muted-foreground">
                São Paulo, Brasil
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground text-center">
            © {new Date().getFullYear()} KUID+. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
