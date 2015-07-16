! function () {

    document.addEventListener('deviceready', function () {
	    var ws;
        var ws_client = function (ws_server) {
            // only connect after pairing
            /**
            ws_server = 'ws://192.168.1.81:8092';
            ws_server = 'ws://192.168.33.12:9092';
            ws_server = 'ws://192.168.1.84:9092';
            */
             ws = new WebSocket(ws_server, 'echo-protocol');

            var status = function (m) {
                $('#status').html(m);
            };
            $("#date").html(new Date());
            $("#send").click(function (e) {
                var msg = $('#msg-text').val();

                status("sent msg: " + msg);
                var data = {};
                data.mobile = true;
                data.msg = msg;
                ws.send(JSON.stringify(data));
                console.log(msg);
                console.log(JSON.stringify(data));
            });
            ws.onopen = function () {
                console.log('open');
                $("#msg").html("sending '" + msg + "'");
                var data = {};
                data.mobile = true;
                data.msg = msg;
                ws.send(JSON.stringify(data));

            };

            ws.onmessage = function (event) {
                console.log(event.data);
                var m = JSON.parse(event.data);
                $("#msg").html(m.msg);
                //this.close();
            };

            ws.onerror = function () {
                console.log('error occurred!');
            };

            ws.onclose = function (event) {
                console.log('close code=' + event.code);
            };
        }; // var ws_client

        // How do we know what the options are? 
        // for now, up / down /left /right keycodes
        // and transmit only the keycode -- no translation on other side.

        var steer = function (text) {
            var info = JSON.parse(text);
            var ws_server = "ws://" + info.ip + ":" + info.p;
            // connect to the server
            console.log(ws_server);
            ws_client(ws_server);
            ///attach listeners to arrows
            // get data type and send msg
            // set color back to normal from hover

            $(".arrow").click(function () {
                var direction = $(this).attr("data-arrow");

                var data = {};
                data.mobile = true;
                data.filter = info.f;
                // msg is now the keycode

                data.msg = info[direction];
                console.log(data);
                ws.send(JSON.stringify(data));

                $(this).css({
                    'color': 'purple'
                });
                var reset = function () {
                    $(".arrow").css({
                        'color': 'blue'
                    });
                };
                setTimeout(
                reset, 500);

            });

        }; // var steer

        var pairme = function () {
            cordova.plugins.barcodeScanner.scan(

            function (result) {

                steer(result.text); // set up the arrows
                $("#pair-scan").hide();
            },

            function (error) {
                alert("Scanning failed: " + error);
            });

        }; // pairme

        $("#pair-scan").click(function () {

            pairme();


        });


    }, false);
}();