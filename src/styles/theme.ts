import { ThemeConfig, extendTheme } from "@chakra-ui/react";


const themeConfig: ThemeConfig = {
    useSystemColorMode: false,
    initialColorMode: 'dark'
  };
  
const theme = extendTheme({ config: themeConfig });

export default theme;