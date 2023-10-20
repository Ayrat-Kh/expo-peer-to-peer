import { NativeWindStyleSheet } from 'nativewind';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppNavigationContainer } from 'src/navigation/AppNavigationContainer';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function Root() {
  return (
    <SafeAreaProvider>
      <AppNavigationContainer />
    </SafeAreaProvider>
  );
}
