import React from "react";
import Card from "antd/es/card/Card";
import { Layout } from "antd";
import Sider from "antd/es/layout/Sider";
import AppHeader from "./Header";
import Sidebar from "./Sidebar";
import Terminal from "./TerminalPanel";

const {Internal} = Layout;

export default function InternalAttacks() {
    return (
        <h2>Internal Attacks</h2>
    //   <Layout style={{minHeight: '100vh'}}>
    //     <AppHeader />
    //     <Layout>
    //         <Sider>
    //             <Sidebar />
    //         </Sider>
    //         <Content style={{padding: '1rem', display:'flex', justifyContent:'center'}}>
    //             <Terminal />
    //         </Content>
    //     </Layout>
    //   </Layout>  
    );
}