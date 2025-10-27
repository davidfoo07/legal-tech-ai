import { Container } from './Container';
import { useTranslation } from 'react-i18next'; // 1. Import hook

export const Footer: React.FC = () => {
  const { t } = useTranslation('common'); // 2. Initialize hook

  return (
    <footer className="border-t border-slate-200 bg-slate-50 mt-auto">
      <Container>
        <div className="py-4">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0">
            <div className="text-sm text-slate-600">
              {t('footer.copyright')}
            </div>
            <div className="text-xs text-slate-500">
              {t('footer.disclaimer')}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
};
