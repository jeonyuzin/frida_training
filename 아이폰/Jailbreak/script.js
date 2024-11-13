console.log("시작 \n");


// // 동적 라이브러리 로딩 및 주소 확인
// const dlopenPtr = Module.getExportByName(null, 'dlopen');
// const dlsymPtr = Module.getExportByName(null, 'dlsym');

// Interceptor.attach(dlopenPtr, {
//     onEnter: function(args) {
//         // args[0]에서 문자열을 읽어 null이 아닌 값을 확인
//         const pathPtr = args[0];
//         this.path = pathPtr.isNull() ? "null" : Memory.readUtf8String(pathPtr);
//         console.log("dlopen 호출됨 - 라이브러리:", this.path);
//     },
//     onLeave: function(retval) {
//         console.log("dlopen 완료:", this.path);
//     }
// });



// Interceptor.attach(dlsymPtr, {
//     onEnter: function(args) {
//         this.symbol = args[1].readCString();
//         console.log("dlsym 호출됨 - 심볼:", this.symbol);
//     },
//     onLeave: function(retval) {
//         console.log("dlsym 완료:", this.symbol);
//     }
// });

//
// const svcInstructionPattern = "01 10 00 D4";
// const nopInstructionBytes = [0x1F, 0x20, 0x03, 0xD5];
// const failedAddresses = []; // 보호 설정 실패 주소를 저장할 배열

// function patchSvcToNop() {
//     console.log("[*] SVC #0x80 패턴을 NOP로 변경합니다...");
//     Memory.scan(Process.enumerateModules()[0].base, Process.enumerateModules()[0].size, svcInstructionPattern, {
//         onMatch: function (address, size) {
//             console.log("[*] SVC #0x80이 발견됨:", address);
//             try {
//                 // 메모리에 쓰기 권한 부여
//                 if (!Memory.protect(address, size, 'rwx')) {
//                     console.log("[!] 메모리 보호 설정 실패:", address);
//                     // 실패한 주소를 배열에 저장
//                     failedAddresses.push(address);
//                     return;
//                 }
//                 address.writeByteArray(nopInstructionBytes);
//                 console.log("[*] SVC #0x80이 NOP로 변경되었습니다:", address);
//             } catch (error) {
//                 console.error("[!] 메모리 패치 오류:", error.message);
//             }
//         },
//         onComplete: function () {
//             console.log("[*] 패치가 완료되었습니다.");
//             // 보호 설정 실패한 주소 목록 출력
//             if (failedAddresses.length > 0) {
//                 console.log("[!] 보호 설정에 실패한 주소 목록:");
//                 failedAddresses.forEach(function (failedAddress) {
//                     console.log(" -", failedAddress);
//                 });
//             }
//         }
//     });
// }

// function monitorFailedAddresses() {
//     console.log("[*] 보호 설정에 실패한 주소들의 접근을 감시합니다...");
//     failedAddresses.forEach(function (failedAddress) {
//         Interceptor.attach(failedAddress, {
//             onEnter: function(args) {
//                 console.log("[!] 접근 감지: 보호 설정 실패 주소 호출됨 - 주소:", failedAddress);
//                 console.log(Thread.backtrace(this.context, Backtracer.ACCURATE)
//                     .map(DebugSymbol.fromAddress).join("\n"));
//             }
//         });
//     });
// }

// patchSvcToNop();




//================================안티 디버깅=====================================


const sysctlAddress = Module.findExportByName(null, 'sysctl');
// console.log("[*] sysctl function address: " + sysctlAddress);

const ptraceAddress = Module.findExportByName(null, 'ptrace');
// console.log("[*] ptrace function address: " + ptraceAddress);

const exitAddress = Module.findExportByName(null, 'exit');
// console.log("[*] exit function address: " + exitAddress);

// Signal 처리 함수 후킹
// Interceptor.attach(Module.findExportByName(null, "signal"), {
//     onEnter: function(args) {
//         console.log("[*] signal 함수가 호출되었습니다. Signal:", args[0].toInt32());
//     }
// });


// AntiDebug ptrace
Interceptor.attach(ptraceAddress, {
    onEnter: function (args) {
        if (args[0].toInt32() == 31) {
            console.log("[D] Bypassed ptrace");
            args[0] = ptr(-1);
        }
    }
});


// AntiDebug getppid
Interceptor.attach(Module.findExportByName(null, 'getppid'), {
    onEnter(args) {
    },
    onLeave(retval) {
        // console.log("[D] Bypassed getppid");
        var ret = retval.toInt32();
        // console.log(`[★] RETAVL: ${ret}`)
        if (ret !== 1) {
            // console.log("[-] Bypassing it...")
            retval.replace(0x1);
        }
    }
});


// AntiDebug sysctl int sysctl(int *name, u_int namelen, void *oldp, size_t *oldlenp, const void *newp, size_t newlen);
// sysctl 무력화 스크립트
Interceptor.attach(Module.findExportByName(null, "sysctl"), {
    onEnter: function (args) {
        var mib = args[0];
        var mibArray = [];
        for (var i = 0; i < 4; i++) { // 일반적으로 첫 4개의 인자가 디버깅 감지용
            mibArray.push(mib.add(i * 4).readInt());
        }
        if (mibArray[0] === 1 && mibArray[1] === 14 && mibArray[2] === 1) {

            this.bypass = true;  // onLeave에서 확인하기 위한 플래그 설정
        }
    },
    onLeave: function (retval) {
        if (this.bypass) {
            retval.replace(0); // 0 반환 (디버거 없음)
        }
    }
});

        // console.log("[*] sysctl 호출 감지: MIB = " + mibArray.join(", "));

        // CTL_KERN(1) + KERN_PROC(14) + KERN_PROC_PID(1)
        // 디버깅 감지용 MIB 배열을 무력화


//================================안티 디버깅=====================================





//========================================프록시 체크//

const targetFunctions = [
    "nw_proxy_create_options",
    "nw_proxy_config_create",
    "nw_proxy_config_supports_connection", //0x1
    "nw_proxy_config_get_mode", //원본값 0x1
    "nw_path_copy_proxy_configs",
    "nw_proxy_config_is_privacy_proxy",//0x0
    "nw_proxy_config_prohibits_direct",//0x1
    "nw_parameters_get_privacy_proxy_fail_closed",//0x0
    "nw_parameters_get_no_proxy",//0x0
    "nw_parameters_get_prefer_no_proxy",//0x0
    "nw_parameters_copy_custom_proxy_configs",//0x0
    "nw_proxy_config_remove_protocols_from_stack",
    "nw_proxy_options_set_authentication_challenge_handler",
    // "nw_tls_copy_sec_protocol_metadata",
    // "nw_tls_copy_sec_protocol_options",
    "nw_parameters_get_https_proxy_over_tls",
    "nw_parameters_get_https_proxy_is_opaque",
    // "nw_connection_copy_protocol_metadata",
    // "nw_protocol_options_copy_definition",
    // "nw_protocol_options_is_tcp",
    // "nw_protocol_metadata_access_handle",
    // "nw_connection_copy_connected_remote_endpoint",
    // "nw_tls_create_options",
    // "nw_quic_connection_set_sec_protocol_options"
];

// 각 함수에 대해 Interceptor.attach 설정
// targetFunctions.forEach(functionName => {
//     try {
//         const funcAddr = Module.getExportByName(null, functionName);
//         if (funcAddr) {
//             Interceptor.attach(funcAddr, {
//                 onEnter: function (args) {
//                     // console.log("Function called:", functionName);
//                 },
//                 onLeave: function (retval) {
//                     console.log(functionName, " : ", retval);
//                 }
//             });
//         } else {
//             // console.log("Function not found:", functionName);
//         }
//     } catch (error) {
//         // console.log("Error hooking function:", functionName, error);
//     }
// });



// Module.enumerateExportsSync("Network").forEach(function(sym) {
//     if (sym.name.includes("nw_endpoint_proxy") || sym.name.includes("proxy")) {
//         console.log(sym.name);
//     }
// });








//=======================================================================================


//==============================sslpinning 우회//
const targetFunctions2 = [
    // "nw_proxy_create_options",
    // "nw_proxy_config_create",
    // "nw_proxy_config_supports_connection",
    // "nw_proxy_config_get_mode",
    // "nw_path_copy_proxy_configs",
    // "nw_proxy_config_is_privacy_proxy",
    // "nw_proxy_config_prohibits_direct",
    // "nw_parameters_get_privacy_proxy_fail_closed",
    // "nw_parameters_get_no_proxy",
    // "nw_parameters_get_prefer_no_proxy",
    // "nw_parameters_copy_custom_proxy_configs",
    // "nw_proxy_config_remove_protocols_from_stack",
    // "nw_proxy_options_set_authentication_challenge_handler",
    // "nw_tls_copy_sec_protocol_metadata",
    // "nw_tls_copy_sec_protocol_options",
    "nw_parameters_get_https_proxy_over_tls",
    "nw_parameters_get_https_proxy_is_opaque",
    "nw_connection_copy_protocol_metadata",
    "nw_protocol_options_copy_definition",
    "nw_protocol_options_is_tcp",
    "nw_protocol_metadata_access_handle",
    "nw_connection_copy_connected_remote_endpoint",
    "nw_tls_create_options",
    "nw_quic_connection_set_sec_protocol_options"
];

// // 각 함수에 대해 Interceptor.attach 설정
// targetFunctions2.forEach(functionName => {
//     try {
//         const funcAddr = Module.getExportByName(null, functionName);
//         if (funcAddr) {
//             Interceptor.attach(funcAddr, {
//                 onEnter: function(args) {
//                     // console.log("Function called:", functionName);
//                 },
//                 onLeave: function(retval){
//                     console.log(functionName," : ",retval);
//                 }
//             });
//         } else {
//             console.log("Function not found:", functionName);
//         }
//     } catch (error) {
//         console.log("Error hooking function:", functionName, error);
//     }
// });



try {
    const functionName = "nw_protocol_options_is_tcp";
    const funcAddr = Module.getExportByName(null, functionName);

    if (funcAddr) {
        Interceptor.attach(funcAddr, {
            onEnter: function(args) {
                // console.log("Function called:", functionName);

                // // 콜 스택 출력
                // console.log("Call Stack:\n" + Thread.backtrace(this.context, Backtracer.ACCURATE)
                //     .map(DebugSymbol.fromAddress).join("\n"));
            },
            onLeave: function(retval) {
                retval.replace(1);
                // console.log("Return value:", retval.toString());
            }
        });
    } else {
        // console.log("Function not found:", functionName);
    }
} catch (error) {


    // console.log("Error hooking function:", functionName, error);
}

function unpin() {
    var SecTrustEvaluate_handle = Module.findExportByName('Security', 'SecTrustEvaluate');
    var SecTrustEvaluateWithError_handle = Module.findExportByName('Security', 'SecTrustEvaluateWithError');
    var SSL_CTX_set_custom_verify_handle = Module.findExportByName('libboringssl.dylib', 'SSL_CTX_set_custom_verify');
    var SSL_get_psk_identity_handle = Module.findExportByName('libboringssl.dylib', 'SSL_get_psk_identity');
    var boringssl_context_set_verify_mode_handle = Module.findExportByName('libboringssl.dylib', 'boringssl_context_set_verify_mode');

    if (SecTrustEvaluateWithError_handle) {
        var SecTrustEvaluateWithError = new NativeFunction(SecTrustEvaluateWithError_handle, 'int', ['pointer', 'pointer']);

        Interceptor.replace(
            SecTrustEvaluateWithError_handle,
            new NativeCallback(function (trust, error) {

                console.log('[*] Called SecTrustEvaluateWithError()');
                SecTrustEvaluateWithError(trust, NULL);
                Memory.writeU8(error, 0);
                return 1;
            }, 'int', ['pointer', 'pointer'])
        );

        console.log('[+] SecTrustEvaluateWithError() hook installed.');
    }

    if (SecTrustEvaluate_handle) {
        var SecTrustEvaluate = new NativeFunction(SecTrustEvaluate_handle, 'int', ['pointer', 'pointer']);

        Interceptor.replace(
            SecTrustEvaluate_handle, new NativeCallback(function (trust, result) {
                console.log('[*] Called SecTrustEvaluate()');
                SecTrustEvaluate(trust, result);
                Memory.writeU8(result, 1);
                return 0;
            }, 'int', ['pointer', 'pointer'])
        );
        console.log('[+] SecTrustEvaluate() hook installed.');
    }

    if (SSL_CTX_set_custom_verify_handle) {
        // SSL_CTX_set_custom_verify 함수의 NativeFunction 선언
        var SSL_CTX_set_custom_verify = new NativeFunction(SSL_CTX_set_custom_verify_handle, 'void', ['pointer', 'int', 'pointer']);
    
        // 대체할 callback 함수 정의
        var replaced_callback = new NativeCallback(function (ssl, out) {
            console.log('[*] Called custom SSL verifier');
            return 0; // 검증 성공으로 처리
        }, 'int', ['pointer', 'pointer']);
    
        // SSL_CTX_set_custom_verify 함수를 대체하는 Interceptor 설정
        Interceptor.replace(
            SSL_CTX_set_custom_verify_handle,
            new NativeCallback(function (ctx, mode, callback) {
                console.log('[*] Called SSL_CTX_set_custom_verify()');
                SSL_CTX_set_custom_verify(ctx, 0, replaced_callback); // 검증 모드를 0으로 설정하고 대체 callback 사용
            }, 'void', ['pointer', 'int', 'pointer']) // 리턴 타입을 void로 설정
        );
    
        console.log('[+] SSL_CTX_set_custom_verify() hook installed.');
    }
    

    if (SSL_get_psk_identity_handle) {
        Interceptor.replace(
            SSL_get_psk_identity_handle, 
            new NativeCallback(function (ssl) {
                console.log('[*] Called SSL_get_psk_identity_handle()');
                return 'notarealPSKidentity';
            }, 'pointer', ['pointer'])
        );

        console.log('[+] SSL_get_psk_identity() hook installed.')
    }

    if (boringssl_context_set_verify_mode_handle) {
        var boringssl_context_set_verify_mode = new NativeFunction(boringssl_context_set_verify_mode_handle, 'int', ['pointer', 'pointer']);

        Interceptor.replace(
            boringssl_context_set_verify_mode_handle,
            new NativeCallback(function (a, b) {
                console.log('[*] Called boringssl_context_set_verify_mode()');
                return 0;
            }, 'int', ['pointer', 'pointer'])
        );
        
        console.log('[+] boringssl_context_set_verify_mode() hook installed.')
    }
}
unpin();




//======================================중요한 잡동사니 ==============================

// Interceptor.attach(exitAddress, {
//     onEnter: function (args) {
//         console.log(`[*] exit 함수가 호출되었습니다.`);
//         console.log("\texit 함수 Backtrace:\n\t" + Thread.backtrace(this.context, Backtracer.ACCURATE)
//             .map(DebugSymbol.fromAddress).join('\n\t'));

//         // Prevent the process from exiting by skipping the original exit function
//         this.context.pc = this.context.lr; // Set the program counter to the link register to skip the exit function
//     }
// });






// // 데이터 추출 함수
// if (ObjC.available) {
//     // 20초(20000ms) 후에 실행
//     setTimeout(function() {
//         var classNames = Object.keys(ObjC.classes);
//         classNames.forEach(function(className) {
//             try {
//                 var cls = ObjC.classes[className];
//                 var methods = cls.$methods;
//                 send({ className: className, methods: methods });
//             } catch (e) {
//                 console.error("[!] 클래스 로드 오류: " + className + " - " + e);
//             }
//         });
//         console.log("모든 클래스와 메서드 추출이 완료되었습니다.");
//     }, 20000); // 20000 밀리초 = 20초

// } else {
//     console.log("Objective-C가 사용 불가능합니다. 이 스크립트는 iOS에서만 동작합니다.");
// }




















// if (ObjC.available) {
//     console.log("[*] 15초 후 모든 메서드 덤프 시작");

//     setTimeout(function() {
//         console.log("[*] 메서드 덤프 중...");

//         // 모든 클래스 순회
//         for (const className in ObjC.classes) {
//             // Alamofire와 관련된 클래스만 출력
//             if (className.startsWith("Alamofire")) {
//                 console.log(`\n[*] 클래스 발견: ${className}`);

//                 const methods = ObjC.classes[className].$ownMethods;
//                 for (let i = 0; i < methods.length; i++) {
//                     console.log(` - 메서드: ${methods[i]}`);
//                 }
//             }
//         }

//         console.log("[*] 메서드 덤프 완료");
//     }, 15000);  // 15초 지연 후 실행

// } else {
//     console.log("[!] ObjC 환경이 아님 - 스크립트 종료");
// }



// const gettimeofdayPtr = Module.getExportByName(null, 'gettimeofday');
// Interceptor.attach(gettimeofdayPtr, {
//     onEnter: function(args) {
//         this.startTime = new Date().getTime();  // 함수 호출 시작 시간 기록
//     },
//     onLeave: function(retval) {
//         const newTime = new Date().getTime();
//         const timeDiff = newTime - this.startTime;

//         // 반환값을 수정하지 않고 함수의 실제 결과에 기초하여 차이 값을 콘솔에 표시
//         console.log("gettimeofday 호출 완료 - 시간 차이:", timeDiff < 10 ? timeDiff : 10);
//     }
// });


// // mach_absolute_time 후킹: 항상 일정 시간만큼 증가하도록 조작
// const mach_absolute_timePtr = Module.getExportByName(null, 'mach_absolute_time');
// Interceptor.attach(mach_absolute_timePtr, {
//     onLeave: function(retval) {
//         const fixedTime = 100000;  // 일정한 시간 값 반환
//         retval.replace(ptr(fixedTime));
//         console.log("mach_absolute_time 호출 수정 - 고정 시간:", fixedTime);
//     }
// });


// =====================================================잡동사니


// // Hooking readlink file check
// var readlinkPtr = Module.findExportByName(null, 'readlink');
// if (readlinkPtr !== null) {
//     Interceptor.attach(readlinkPtr, {
//         onEnter: function (args) {
//             var path = Memory.readUtf8String(args[0]);
//             console.log("[*] \x1b[36mreadlink\x1b[0m called with path: \x1b[33m" + path + "\x1b[0m");
//         },
//         onLeave: function (retval) {
//             retval.replace(ptr('0xffffffffffffffff'));
//             console.log("[*] \x1b[36mreadlink\x1b[0m bypassed with value: \x1b[32m" + retval + "\x1b[0m");
//         }
//     });
// } else {
//     console.log("[-] \x1b[31mreadlink\x1b[0m not found");
// }



// Interceptor.attach(Module.findExportByName(null, 'syscall'), {
//     onEnter: function (args) {
//         if (args[0].toInt32() == 26 && args[1].toInt32() == 31) {
//             console.log("[D] Bypassed ptrace+syscall");
//             args[1] = ptr(0x0);
//         }
//     }
// });

// //AntiDebug isatty
// Interceptor.attach(Module.findExportByName(null, 'isatty'), {
//     onEnter(args) {
//     },
//     onLeave(retval) {
//         console.log("[D] Bypassed isatty");
//         return 0;
//     }
// });

// // AntiDebug ioctl
// Interceptor.attach(Module.findExportByName(null, 'ioctl'), {
//     onEnter(args) {
//     },
//     onLeave(retval) {
//         console.log("[D] Bypassed ioctl");
//         return -1;
//     }
// });

