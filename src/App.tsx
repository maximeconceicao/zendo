import { RouterProvider } from 'react-router-dom';
import { PwaUpdatePrompt } from 'src/domains/shared/components/PwaUpdatePrompt';
import { AppDataProvider } from 'src/store/AppDataContext';
import { MeditationActiveProvider } from 'src/store/MeditationActiveContext';
import { router } from 'src/router';

export function App() {
  return (
    <AppDataProvider>
      <MeditationActiveProvider>
        <RouterProvider router={router} />
        <PwaUpdatePrompt />
      </MeditationActiveProvider>
    </AppDataProvider>
  );
}
