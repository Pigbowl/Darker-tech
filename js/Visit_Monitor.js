        // 生成用户唯一标识（优先从sessionStorage.userData获取Name，否则生成随机ID）
        function getUserId() {            
            // 尝试从sessionStorage.userData获取Name字段
            if (sessionStorage.userData) {
                try {
                    const userData = JSON.parse(sessionStorage.userData);
                    if (userData.Name) {
                        return [userData.Name,"Member"];
                    }
                } catch (e) {
                    console.error('解析userData失败:', e);
                }
            }
            
            // 如果没有登录或获取失败，使用原有的随机ID逻辑
            let userId = localStorage.getItem('site_user_id');
            if (!userId) {
                // 生成随机唯一ID（如UUID）
                userId = 'user_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
                localStorage.setItem('site_user_id', userId);
            }
            return [userId,"Visitor"];
        }

        // 生成会话ID（每次打开浏览器/标签页时创建，存储在sessionStorage，关闭后失效）
        function getSessionId() {
            let sessionId = sessionStorage.getItem('site_session_id');
            if (!sessionId) {
                sessionId = 'session_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
                sessionStorage.setItem('site_session_id', sessionId);
            }
            return sessionId;
        }

        // 发送统计数据到后端
        function trackPageView() {
            const data = {
                page_url: window.location.pathname, // 当前页面路径（如"/home.html"）
                user_ad: getUserId()[0],  
                visit_kink: getUserId()[1],
                session: getSessionId(),         // 会话ID
                // timestamp: new Date().getTime(),    // 时间戳
                from_page: document.referrer         // 来源页面（前一个页面的URL）
            };

            const uservisit = {}

            if (sessionStorage.userData && !JSON.parse(sessionStorage.userData).UserLevel.startsWith('Manager')){
                uservisit["userid"] = JSON.parse(sessionStorage.userData).ID
                uservisit["page"] = data.page_url.split('/').pop();
            }


            // 判断当前页面路径是否包含 sitedashboard 或 login
            if (deploy_mode != 'test' && getUserId()[0] != 'Admin'&& getUserId()[0] != 'testman'){
                console.log("sneding visit data to server")
                command = ip + '/add_visit'
                fetch(command,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        datatype:'operation',
                        "data":data,
                        "uservisit":uservisit
                    })
                }).then(response=>response.json()).then(data=>{
                    if(data.success){

                    }
                })}
            // // 发送请求到后端接口（用fetch或img标签避免跨域问题）
           
        }

        // 页面加载完成后触发统计
        window.addEventListener('load', trackPageView);