// Learn more on how to config.
// - https://github.com/dora-js/dora-plugin-proxy#规则定义

module.exports = {
  'GET /api/menus'(req, res) {
    res.json(
      {
        "success": true,
        "data": [
          {
            key: "manage",
            title: "管理",
            list: [
              {
                "key": "project",
                "title": "微信号管理",
                "list": [
                  {
                    "_id": "5808b4c7bc1d3a2264001921",
                    "key": "project",
                    "title": "微信库",
                    "uri": "/list",
                    "group": "project",
                    "model": "manage",
                    "sort": 0
                  },
                  {
                    "_id": "5808b4c7bc1d3a2264001925",
                    "key": "project/create",
                    "title": "创建微信",
                    "uri": "/create",
                    "group": "project",
                    "model": "manage"
                  },
                  {
                    "_id": "5808b4c7bc1d3a2264001926",
                    "key": "project/edit",
                    "title": "编辑微信",
                    "uri": "/create/{id}",
                    "group": "project",
                    "model": "manage"
                  }
                ]
              },
              {
                "key": "channel",
                "title": "渠道管理",
                "list": [
                  {
                    "_id": "5808b4c7bc1d3a2264001922",
                    "key": "channel",
                    "title": "渠道列表",
                    "uri": "/list",
                    "group": "channel",
                    "model": "manage",
                    "sort": 0
                  },
                  {
                    "_id": "5808b4c7bc1d3a2264001927",
                    "key": "channel/create",
                    "title": "新建渠道",
                    "uri": "/create",
                    "group": "channel",
                    "model": "manage"
                  },
                  {
                    "_id": "5808b4c7bc1d3a2264001928",
                    "key": "channel/edit",
                    "title": "编辑渠道",
                    "uri": "/create/{id}",
                    "group": "channel",
                    "model": "manage"
                  }
                ]
              },
              {
                "key": "card",
                "title": "SIM卡柜",
                "list": [
                  {
                    "_id": "5808b4c7bc1d3a2264001923",
                    "key": "card",
                    "title": "SIM柜列表",
                    "uri": "/list",
                    "group": "card",
                    "model": "manage",
                    "sort": 0
                  },
                  {
                    "_id": "5808b4c7bc1d3a2264001929",
                    "key": "card/position",
                    "title": "新建卡柜位",
                    "uri": "/position",
                    "group": "card",
                    "model": "manage"
                  },
                  {
                    "_id": "5808b4c7bc1d3a226400192a",
                    "key": "card/phone",
                    "title": "录入电话号",
                    "uri": "/phone",
                    "group": "card",
                    "model": "manage"
                  },
                  {
                    "_id": "5808b4c7bc1d3a226400192b",
                    "key": "card/success",
                    "title": "录入信息提示",
                    "uri": "/success",
                    "group": "card",
                    "model": "manage"
                  }
                ]
              },
            ]
          },
          {
            key: 'system',
            title: '系统',
            list: [
              {
                "key": "password",
                "title": "微系统管理",
                "list": [
                  {
                    "_id": "5808b4c7bc1d3a2264001924",
                    "key": "password",
                    "title": "修改密码",
                    "uri": "/amend",
                    "group": "password",
                    "model": "system",
                    "sort": 0
                  },
                  {
                    "_id": "5808b4c7bc1d3a226400192c",
                    "key": "password",
                    "title": "修改信息提示",
                    "uri": "/success",
                    "group": "password",
                    "model": "system"
                  }
                ]
              }
            ]
          },
        ]
      }
    )
  },


  'POST /api/disable'(req, res) {
    res.json({
      success: true,
      data: [],
    });
  },
  'POST /auth/password/modify'(req, res) {
    res.json({
      success: true,
      data: 'modify Password successed',
    })
  },
  'POST /v1/api/upload'(req, res) {
    res.json({
      success: true,
      data: [],
    });
  },

  'GET /v1/wxclients'(req, res) {
    res.json({
      success: true,
      data: {
        total: 20,
        per_page: 5,
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
        from: 1,
        to: 3,
        data: [{
          mobile: '18812345678',
          nickName: 'shawn',
          contactNum: '123',
          password: '1234qwer',
          loginStatus: 1,
          status: 1,
          _id: '12343244',
          uin: '',
          "index": {
            "book": 2,
            "page": 3,
            "box": 10,
          },
          name: '实惠',
          project: '闸北马永贞',
          operation: [{
            key: 'removeUIN',
            url: ""
          }, {
            key: 'edit',
            url: ""
          }, {
            key: 'qrcode',
            url: ""
          },]
        },],
      },
    });
  },
  'GET /v1/wxclients/:id'(req, res) {
    const id = req.params.id;
    res.json({
      success: true,
      data: {
        _id: id,
        nickName: '闸北李小龙',
        name: '腾讯',
        contact: '张小龙',
        contactTel: "18882256523",
        startDate: "2016-10-10 00:00:00",
        endDate: "2017-10-17 00:00:00",
        options: { ecoModule: ['基础信息'] },
        index: { book: 9, page: 1, box: 1 },
        email: '3345685@qq.com',
        password: 'abc654654',
        qrcode: '',
        uin: '0',
      },
    });
  },
  'PATCH /v1/wxclients/:id'(req, res) {
    const id = req.params.id;
    res.json({
      success: true,
      data: {
        _id: id,
        nickName: '闸北李小龙',
        name: '腾讯',
        contact: '张小龙',
        contactTel: "18882256523",
        startDate: "2016-10-10 00:00:00",
        endDate: "2017-10-17 00:00:00",
        options: { ecoModule: ['基础信息'] },
        index: [1, 1, 2],
        email: '3345685@qq.com',
        password: 'abc654654',
        qrcode: '',
        uin: '0',
      },
    });
  },
  'POST /v1/wxclients'(req, res) {
    res.json({
      success: true,
      data: 'successed',
    });
  },

  'PUT /v1/wxclients/:id'(req, res) {
    res.json({
      success: true,
      data: 'successed',
    });
  },

  'GET /v1/simCards/indexes/books'(req, res) {
    res.json({
      "success": true,
      "data": {
        "totle": 6,
        "data": [
          1,
          2,
          3,
          4,
          5,
          6,
        ]
      }
    })
  },
  'GET /v1/simCards'(req, res) {
    res.json({
      "success": true,
      "data": {
        "total": 60,
        "per_page": 20,
        "current_page": 1,
        "last_page": 3,
        "next_page_url": "http://localhost/v1/simCard?page=2",
        "prev_page_url": null,
        "from": 1,
        "to": 20,
        "data": [{
          "mobile": 12123,
          "index": {
            "book": 2,
            "page": 3,
            "box": 10,
          },
          "company_id": "",
          "index": {
            "book": 2,
            "page": 3,
            "box": 10,
          },
          "hasWxClint": false, //是否已绑定微信
          "name": "实惠",

        },

        ]
      }
    })
  },
  'POST /v1/simCards'(req, res) {
    res.json({
      success: true,
      data: [],
    })

  },
  'PUT /v1/simCards/:id'(req, res) {
    res.json({
      success: true,
      data: [],
    })

  },
  'GET /v1/simCards/:id'(req, res) {
    res.json({
      success: true,
      data: [],
    })

  },

  'GET /v1/companies'(req, res) {
    res.json({
      success: true,
      data: {
        total: 20,
        per_page: 5,
        current_page: 1,
        last_page: 1,
        next_page_url: null,
        prev_page_url: null,
        from: 1,
        to: 3,
        data: [
          {
            _id: 2,
            name: '腾讯',
            contact: '张小龙',
            contactTel: "18882256523",
            startDate: "2016-10-10 00:00:00",
            endDate: "2017-10-17 00:00:00",
            options: { ecoModule: ['基础信息', '社交信息'] },
            wxClientCount: 3424,
            projectCount: 2222,

          },
          {
            _id: 3,
            name: '腾讯',
            contact: '张小龙',
            contactTel: "18882256523",
            startDate: "2016-10-10 00:00:00",
            endDate: "2017-10-17 00:00:00",
            options: { ecoModule: ['基础信息'] },
            wxClientCount: 3424,
            projectCount: 2222,
          },
          {
            _id: 24,
            name: '腾讯',
            contact: '张小龙',
            contactTel: "18882256523",
            startDate: "2016-10-10 00:00:00",
            endDate: "2017-10-17 00:00:00",
            options: { ecoModule: ['基础信息'] },
            wxClientCount: 3424,
            projectCount: 2222,
            deleted_at: '',
          },
          {
            _id: 24432,
            name: '腾讯',
            contact: '张小龙',
            contactTel: "18882256523",
            startDate: "2016-10-10 00:00:00",
            endDate: "2017-10-17 00:00:00",
            options: { ecoModule: ['基础信息'] },
            wxClientCount: 3424,
            projectCount: 2222,

          },
          {
            _id: 222144,
            name: '腾讯',
            contact: '张小龙',
            contactTel: "18882256523",
            startDate: "2016-10-10 00:00:00",
            endDate: "2017-10-17 00:00:00",
            options: { ecoModule: ['基础信息'] },
            wxClientCount: 3424,
            projectCount: 2222,

          },
        ],
      },
    });
  },

  'GET /v1/companies/:id'(req, res) {
    const id = req.params.id;
    res.json({
      success: true,
      data: {
        _id: id,
        name: '腾讯',
        contact: '张小龙',
        contactTel: "18882256523",
        startDate: "2016-10-10 00:00:00",
        endDate: "2017-10-17 00:00:00",
        options: { ecoModule: [] },
        wxClientCount: 3424,
        projectCount: 2222,
        serverTime: ['2016-10-05', '2017-05-05'],
        email: '3345685@qq.com',
        password: '2341431',
      },
    });
  },
  'OPTIONS /v1/companies/:id'(req, res) {
    const id = req.params.id;
    res.json({
      success: true,
      data: {
        _id: id,
        name: '腾讯',
        contact: '张小龙',
        contactTel: "18882256523",
        startDate: "2016-10-10 00:00:00",
        endDate: "2017-10-17 00:00:00",
        options: { ecoModule: [] },
        wxClientCount: 3424,
        projectCount: 2222,
        serverTime: ['2016-10-05', '2017-05-05'],
        email: '3345685@qq.com',
        password: '2341431',
      },
    });
  },
  'DELETE /v1/companies/:id'(req, res) {
    const id = req.params.id;
    res.json({
      success: true,
      data: {
        _id: id,
        name: '腾讯',
        contact: '张小龙',
        contactTel: "18882256523",
        startDate: "2016-10-10 00:00:00",
        endDate: "2017-10-17 00:00:00",
        options: { ecoModule: ['基础信息'] },
        wxClientCount: 3424,
        projectCount: 2222,
        serverTime: ['2016-10-05', '2017-05-05'],
        email: '3345685@qq.com',
        password: '2341431',
        deleted_at: '',
      },
    });
  },
  'POST /v1/companies'(req, res) {
    res.json({
      success: true,
      data: [],
    })
  },
  'PUT /v1/companies/:id'(req, res) {
    res.json({
      success: true,
      data: [],
    })

  },

  'GET /res/wxClients'(req, res) {
    res.json({
      success: true,
      data: [{
        _id: 1,
        mobile: '122331',
        index: 10202,
        nickName: '马永贞',
      },
      {
        _id: 2,
        mobile: '122331',
        index: 10202,
        nickName: '马永贞',
      },
      {
        _id: 3,
        mobile: '122331',
        index: 10202,
        nickName: '马永贞',
      },
      ]
    })
  },
  'PATCH /res/wxClients/:id'(req, res) {
    const id = req.params.id
    res.json({
      success: true,
      data: {

      },
    })
  },

};
