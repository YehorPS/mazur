import AccountsService from './AccountsService.js'

class AccountsController{
    async login(req,res){
        try {
            res.render('login',{title:"login page"})

        }catch(e){
            res.json(e.message)
        }
    }
    async loginValidate(req,res){
        try {
            const isValidated=await AccountsService.validate(req.body)
            if(isValidated){
                res.redirect('/api/collections')
            }else{
                res.render('login',{title:"Can`t find account"})
            }
        }catch(e){
            res.json(e.message)
        }
    }
    async register(req,res){
        try {
            res.render('register',{title:"register page"})

        }catch(e){
            res.json(e.message)
        }
    }
    async createAccount(req,res){
        try {
            const account = await AccountsService.createAccount(req.body.login,req.body.password)
            return res.redirect('/api/login')
        }catch(e){
            res.json(e.message)
        }
    }
}

export default new AccountsController()