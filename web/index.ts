const { H, R } = (window as any);

const App = (_: any) => {
    console.log("Test");
    return null
};

R(H(App), document.getElementById('app'));
