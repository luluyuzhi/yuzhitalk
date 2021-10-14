 我希望有一个类能做到， 做一个 核心的 与协议相关的 与 服务 无关的 一个, 协议托管者，他负责 has - a  状态去 处理 协议
 功能大概是这样的：
 1. 解析协议
 2. 处理协议 -> 整合钩子，进行处理 
 3. 协议状态管理 => 
 4. 用户状态共享 => Dapr

 因此我们需要知道 我们需要知道 如何去拆分组件, 有必要 把这四个功能拆开吗

 1. 协议解析是 完全交给 grpc 的处理的 外面只封装了 薄薄 的一层
 2. 处理协议 -》 根据 协议的不同处理一些 规则， 但是 现在 聊天 只有转发， （处理协议是 一个很重要的点 未来 很多新增的功能 都会与此相关）
 3. 协议状态管理 与 处理协议 绑定 能完成



 核心功能：

 内部协议设计：
    A->B 发送消息
    {
        timestamp: 123456789,
        from: 'A',
        to: 'B',
        content: 'hello'
    }

    type
    {
        type: 'create' | 'up' | 'delete' | 'down' | search,
        name: '',
        user?: [],
    }

    yuzhi://userid:*@.servier_name/*/*/type=create&name=yuzhi


    yuzhi://userid:*@.server_name/user/type=create
    yuzhi://userid:groupid@.server_name/group/type=create


    // 用户登录后创建一个 user 的内存账号，用户token 认真后自动创建 与 socket 绑定的内存账号
    yuzhi://*:*.server-chat/user/userid/

    A->B 群组发消息 群组所有内容必须在内存中存在，如果不存在创建。
    
    //创建需要两个条件一个是 创建的发起人： 创建者必须是登录的用户， 创建者必须是群组的成员。 需要校验
    //在创建后会拉取所有组用户的成员信息
    yuzhi://create_id:*.server-chat/group/groupid/

    创建新群组：

    yuzhi://create_id:*.server-chat/group/groupid/type=create&name=yuzhi&user=userid1,userid2,userid3

    删除群组：
    
    yuzhi://create_id:*.server-chat/group/groupid/type=delete

    B->A 发送消息