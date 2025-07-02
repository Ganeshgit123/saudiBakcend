import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Validators from "../../Validators";
import JWT from 'jsonwebtoken'
import Env from '@ioc:Adonis/Core/Env'
const JWT_SECRET_KEY = Env.get('JWT_SECRET_KEY')
import { AdminRepo, RoleRepo } from "../../Repositories";
import { SUCCESS, FAILURE } from "../../Data/language";
import { AdminDomain } from "../../Domain";

export default class AdminsController {

    // admin login
    public async login({ request }: HttpContextContract) {
        const { email, password } = await request.validate(Validators.AdminAuthValidator);
        const language = request.header('language') || 'en'

        const maybeAdmin = await AdminRepo.checkAdmin(email, password);

        if (maybeAdmin) {

            let data = {
                id: maybeAdmin.id,
                userType: maybeAdmin.userType,
            }
            var token = JWT.sign(data, JWT_SECRET_KEY);

            let roles = await RoleRepo.isRoleExist(Number(maybeAdmin.userType));

            return {
                success: true,
                token: token,
                id: maybeAdmin.id,
                roles: roles ? JSON.parse(roles.permission) : '',
                userType: maybeAdmin.userType,
                massage: SUCCESS.ADMIN_LOGIN[language]
            };
        } else {
            return {
                success: false,
                massage: FAILURE.ADMIN_CONFLICT[language]
            };
        }
    }

    public async changePassword({ request }: HttpContextContract) {
        const { email, oldPassword, newPassword } = await request.validate(Validators.ChangePassword);

        const maybeAdmin = await AdminRepo.checkAdmin(email, oldPassword);

        const data = {
            password: newPassword
        }
        const language = request.header('language') || 'en'

        if (maybeAdmin) {
            await AdminRepo.updateAdmin(maybeAdmin.id, data, language)
            return {
                success: true,
                massage: SUCCESS.ADMIN_PASSWOD_UPDATE[language]
            };

        } else {
            return {
                success: false,
                massage: FAILURE.ADMIN_CONFLICT[language]
            };
        }
    }

    public async getAdminList({ params }: HttpContextContract) {
        return {
            success: true,
            data: AdminDomain.createFromArrOfObject(
                await AdminRepo.getAdmin(params.id)
            ),
        };
    }

    public async createAdmin({ request }: HttpContextContract) {
        const payload = await request.validate(Validators.AdminValidator);

        const language = request.header('language') || 'en'

        const adminResult = await AdminRepo.createAdmin(payload, language);

        return {
            success: true,
            result: AdminDomain.createFromObject(adminResult),
            massage: SUCCESS.ADMIN_CREATE[language]
        };
    }

    public async updateAdmin({ request, params }: HttpContextContract) {
        const updateAdmin = request.all()

        await AdminRepo.isEntryExist(params.id);
        const language = request.header('language') || 'en'

        const updateResult = AdminDomain.createFromObject(
            await AdminRepo.updateAdmin(params.id, updateAdmin, language)
        );
        return {
            success: true,
            result: updateResult,
            massage: SUCCESS.ADMIN_UPDATE[language]
        };
    }

    public async deleteAdmin({ request, params }: HttpContextContract) {
        const result = await AdminRepo.isIdExist(params.id);
        const language = request.header('language') || 'en'

        await AdminRepo.deleteAdmin({ active: 0 }, result, language);
        return {
            success: true,
            massage: SUCCESS.ADMIN_DELETE[language]
        };

    }

    async logout({ request, response }) {
        let token = request.headers().authorization || '';
        const language = request.header('language') || 'en';
        if (token && token.startsWith("Bearer "))
            token = token.slice(7, token.length);
        if (token) {
            const decoded = await JWT.verify(token, JWT_SECRET_KEY, async (err, decodedData) => {
                if (err)
                    return false;
                return decodedData;
            });
            if (!decoded)
                return response.status(422).send({
                    msg: `JWT Expired`
                });
        }
        return {
            success: true,
            massage: SUCCESS.LOGOUT[language],
        };
    }
}
