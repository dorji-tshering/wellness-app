import { Routes, Route } from "react-router-dom";
import { ROUTE_CONSTANT } from "../model/constants/navigation-constant";

export const Navigation = () => {
  return (
    <Routes> 
      {
        ROUTE_CONSTANT.map((page, idx) => {
          const Component = page.page;
          return <Route key={idx} path={page.name} element={<Component />} />
        })
      }
    </Routes>
  )
}

export default Navigation;