import Providers from './providers';
import Layout from '../src/components/Layout';
import '../src/styles/index.css';
import '../src/components/Layout.css';
import '../src/components/ProgressSteps.css';
import '../src/ui/LandingPage.css';
import '../src/ui/DeliveryAddress.css';
import '../src/ui/Configurator.css';
import '../src/ui/Checkout.css';
import '../src/ui/CheckoutPayment.css';
import '../src/ui/CheckoutReview.css';
import '../src/ui/ThankYou.css';

export const metadata = {
  title: 'AboShop – Newspaper Subscription',
  description: 'Subscribe to your daily or weekend newspaper with flexible checkout steps.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <Layout>{children}</Layout>
        </Providers>
      </body>
    </html>
  );
}
