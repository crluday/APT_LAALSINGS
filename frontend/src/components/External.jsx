import React from "react";
import { Layout } from "antd";
import AppHeader from "./Header";
import Sider from "antd/es/layout/Sider";
import Sidebar from "./Sidebar";
// import Card from "antd/es/card/Card";
import Terminal from "./TerminalPanel";

const {Content} = Layout;

export default function ExternalAttacks() {
    return (
      <Layout style={{minHeight: '100vh'}}>
        <AppHeader />
        <Layout>
            <Sider>
                <Sidebar />
            </Sider>
            <Content style={{ padding: '0rem'}}>
                <Terminal style={{width:'500px'}}/>
            </Content>
        </Layout>
      </Layout>  
    );
}