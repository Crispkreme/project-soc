import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from "expo-router/drawer";
import { RiHome9Line } from "react-icons/ri";

const Layout = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen 
          name='index'
          options={{ 
            drawerLabel: 'Home',
            drawerIcon: () => (
              <RiHome9Line size={24} color='white' />
            )
          }}
        />
      </Drawer>
    </GestureHandlerRootView>   
  )
}

export default Layout;
