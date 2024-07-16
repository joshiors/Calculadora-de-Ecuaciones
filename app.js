function operar(input){
    let nube = []
    
    for(let i=0; i<input.length; i++){
        let num = ''

        for(let i1=0; i1<input[i].length; i1++){
            if(input[i][i1]=='+' || input[i][i1]=='-'){
                nube.push(input[i][i1])
            } else {
                num+=input[i][i1]
            }
            
            i1==input[i].length-1 && nube.push(num)
        }
    }
    input=nube

    for(let i=0; i<input.length; i++){
        (i==0 && input[i] == '0') && input.splice(i, 1)

        if((input[i] == '+' || input[i] == '-') && i>0){
            if(input[i] == input[i-2]){ 
                let res = +input[i-1] + +input[i+1]
                input.splice(i-1, 3, res)
                i=1;
            } else if(input[i] !== input[i-2]){
                const sign = +input[i-1] > +input[i+1] ? input[i-2] : input[i] //'+'

                let res = (+input[i-1] - +input[i+1])+""
                res[0]=="-" && (res=res.slice(1))
                input.splice(i-2, 4, res)
                input.unshift(sign)
                i=1;
            }
        }
    }
    input[0].length==2 && input[0][1]=='0' && (input[0]=input[0].slice(1)) //tal vez meter ciertas cosas (como que si es cero se hace algo) dentro de operar y no fuera. //creo que esto ya no es útil.

    input[0]+=input[1]
    input.pop()

    return input;
}

function adaptar(input){
    let res = ""
    
    res+=input[0]
    for(let i=1; i<input.length; i++){
        if(input[i]=="+" || input[i]=="-" || input[i]=="="){
            res+=` ${input[i]} `
        } else if(input[i]==" "){
            if(i+1==input.length-1){
                input=input.slice(0, i)+input[i+1]
                i=1
            } else{
                input=input.slice(0, i)+input.slice(i+1, input.length)
            }
            i-=1
        } else{
            res+=input[i]
        }
    }

    return res
}

function resolver(input){
    const ecuacion = adaptar(input)

    const ec = ecuacion.split(' ');
    let ec1 = [], ec2 = [], pIgual
    
    for(let i=0; i<ec.length; i++){
        ec[i] == '-' && (ec[i+1]='-'+ec[i+1]) && ec.splice(i, 1)
        ec[i] == '+' && (ec[i+1]='+'+ec[i+1]) && ec.splice(i, 1)

        ec[i]=="=" && (pIgual=i)

        i < ec.indexOf('=') ? ec1.push(ec[i]) : ec2.push(ec[i]);
    }
    ec2.shift();

    //añadimos su respectivo signo al primer elemento de ambos lados
    if(ec[0][0]!=='+' && ec[0][0]!=='-'){
        ec[0] = '+'+ec[0]
    }
    if(ec[pIgual+1][0]!=='+' && ec[pIgual+1][0]!=='-'){
        ec[pIgual+1] = '+'+ec[pIgual+1]
    }

    // ec = [...ec1, '=', ...ec2] //antes ec era const***

    //"cambio de lado"
    let flag = false //para saber si estamos en la derecha o izquierda de la ecuación

    for(let i=0; i<ec.length; i++){
        if(ec[i]=='='){
            flag=true
        } else if (ec[i][ec[i].length-1] == 'x' && flag){
            const sign = ec[i][0]=='+' ? '-' : '+'
            const res = sign+ec[i].slice(1)
            ec.splice(i, 1)
            ec.unshift(res)
            i-=1
        } else if(ec[i][ec[i].length-1] !== 'x' && !flag){ //si el último no es x... (o sea, es número pelao) / aqui caen los que no tienen la x, pero también los que no tienen el flag, o cualquiera que está a la izquierda, por lo que no podemos ahorrarnos todo menos el !flag.
            const sign = ec[i][0]=='+' ? '-' : '+'
            const res = sign+ec[i].slice(1)
            ec.push(res)
            ec.splice(i, 1)
            i-=1
        }
    } //ahorrarme los indexOf innecesarios, que ejecutan ciclos cuando no es necesario (si sabemos que los signos y que los 'x' tendrán una posición definida en los strings ([0] y length-1) no hay por qué buscarlos comparando con cada carácter del string) / podría ahorrar el código que se repite arriba, pero implicaría poner las variables antes de comprobar si el ec[i] es alguno de los dos casos útiles, y en la mayoría de los casos no lo será y estaremos creando variables innecesariamente por querer ahorrar únicamente 3 líneas de código. / evaluar cómo queda mejor el código y mejor optimizado (luego de eliminar los indexOf en ambos): si con la manera de hacer el cambio de signo en ec o si hacerlo en ec1 y ec2 por separado. / subir el código sin la optimización de los indexOf y varias, y luego actualizarlo a la versión optimizada.

    ec1=[], ec2=[]
    for(let i=0; i<ec.length; i++){
        i < ec.indexOf('=') ? ec1.push(ec[i]) : ec2.push(ec[i]);
    }
    ec2.shift();

    ec2.length==0 && ec2.push(0)

    for(let i=0; i<ec1.length; i++){
        if(ec1[i].length==2){
            ec1[i] = ec1[i].slice(0, 1)+"1"
        } else{
            ec1[i] = ec1[i].slice(0, ec1[i].length-1)
        }
    }

    ec1.length>1 && (ec1=operar(ec1))

    if(ec2[0][1]=="0" && ec2.length>1){
        ec2.shift()
    }

    ec2.length>1 && (ec2=operar(ec2))

    if(ec1[0][0]=='-'){
        ec1[0]=ec1[0].slice(1)
        ec2[0]*=-1
    }

    ec1[0]==1 ? ec1[0]='x' : ec1[0]+='x'
    
    ec1[0]!=='x' && (function(){
        const notX = ec1[0].slice(0, ec1[0].length-1)
        if(ec1[0].indexOf('/') == -1){
            ec2[0]=ec2[0]+'/'+notX
        } else if(ec1[0].indexOf('/') !== -1){
            ec2[0]=ec2[0]*notX
        }
        ec1[0] = 'x'
    })()

    ec2[0][0] == '+' && (ec2[0]=ec2[0].slice(1))

    return ec1+'='+ec2;
}

//ejemplo de uso
// const ecuacion = '-31x-5=12-7x';
const ecuacion = '2 + 4x = 12';
console.log(resolver(ecuacion));




// //pendientes:
//optimizar el código y reordenarlo.
//resolver las multiplicaciones y divisiones.