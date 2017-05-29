onload = function(){
    //WebGLのコンテキスト準備
    var canvas = document.getElementById("canvas");
    canvas.width = 300;
    canvas.height = 300;

    var gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

    gl.clearColor(0.0,0.0,0.0,1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    var v_shader = create_shader('vs');
    var f_shader = create_shader('fs');

    var prg = create_program(v_shader, f_shader);

    var attLocation = gl.getAttribLocation(prg, 'position');

    //attributeの要素数（この場合xyzの三要素）
    var attStride = 3;

    var vertex_position = [
        0.0, 1.0, 0.0,
        1.0, 0.0, 0.0,
        -1.0, 0.0, 0.0
    ];

    var vbo = create_vbo(vertex_position);

    gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
    gl.enableVertexAttribArray(attLocation);
    gl.vertexAttribPointer(attLocation, attStride, gl.FLOAT, false, 0, 0);

    var m = new matIV();

    var mMatrix = m.identity(m.create());
    var vMatrix = m.identity(m.create());
    var pMatrix = m.identity(m.create());
    var mvpMatrix = m.identity(m.create());

    //ビュー座標変換行列
    m.lookAt([0.0, 1.0, 3.0], [0, 0, 0], [0, 1, 0], vMatrix);

    //プロジェクション変換行列
    m.perspective(90, canvas.width / canvaas.height, 0.1, 100, pMatrix);

    //各行列をかけ合わせて座標変換行列を完成させる
    m.multiply(pMatrix, vMatrix, mvpMatrix);
    m.multiply(mvpMatrix, mMatrix, mvpMatrix);
    
    var uniLocation = gl.getUniformLocation(prg, 'mvpMatrix');
    gl.uniformMatrix4fv(uniLocation, false, mvpMatix);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    gl.flush();

    //シェーダを生成，コンパイルする関数
    function create_shader(id){
        var shader;
        var scriptElement = document.getElementById(id);
        if(!scriptElement){return;}
        
        switch(scriptElement.type){
            case 'x-shader/x-vertex':
                shader = gl.createShader(gl.VERTEX_SHADER);
                break;
            
            case 'x-shader/x-fragment':
                shader = gl.createShader(gl.FRAGMENT_SHADER);
                break;
            defalt:
                return;
        }

        gl.shaderSource(shader, scriptElement.text);
        gl.compileShader(shader);
        if(gl.getShaderParameter(shader, gl.COMPILE_STATUS)){
            return shader;
        }else{
            alert(gl.getShaderInfoLog(shader));
        }
    }

    //プログラムオブジェクトの生成とシェーダのリンクを行う関数
    function create_program(vs, fs){
        var program = gl.createProgram();

        gl.attachShader(program, vs);
        gl.attachShader(program, fs);

        gl.linkProgram(program);

        if(gl.getProgramParameter(program, gl.LINK_STATUS)){
            gl.useProgram(program);
            return program;
        }else{
            alert(gl.getParameterInfoLog(program));
        }

    }

    //VBOを生成する関数
    function create_vbo(data){
        var vbo = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        return vbo;
    }
};
