import { AppNavigationContainer } from 'src/navigation/AppNavigationContainer';
import { NativeWindStyleSheet } from 'nativewind';

NativeWindStyleSheet.setOutput({
  default: 'native',
});

export default function Root() {
  return <AppNavigationContainer />;
}
