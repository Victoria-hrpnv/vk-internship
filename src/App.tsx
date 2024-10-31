
import ItemList from "./components/itemList/ItemList.tsx";

import {ConfigProvider} from "antd";

function App() {

    return (
      <ConfigProvider theme={{ token: { colorPrimary: '#0077FF',
          colorPrimaryHover: '#0077FF',} }}>
      <ItemList />
      </ConfigProvider>
  )
}

export default App
