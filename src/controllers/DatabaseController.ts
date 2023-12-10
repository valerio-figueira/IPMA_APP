import { Request, Response } from "express";
import Database from "../db/Database";
import * as path from "path";
import * as fs from "fs";
import CustomError from "../utils/CustomError";
import { UploadedFile } from "express-fileupload";


class DatabaseController {
    private db: Database


    constructor(database: Database) {
        this.db = database
    }



    async SyncModels(req: Request, res: Response) {
        try {
            res.status(200).json(await this.db.syncModels())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }




    async Backup(req: Request, res: Response) {
        try {
            const { readStream, encryptedFileName } = await this.db.backupDatabase()

            res.setHeader('Content-Type', 'application/pgp-encrypted');
            res.setHeader('Content-Disposition', `attachment; filename="${encryptedFileName}"`);

            readStream.pipe(res)
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }




    async RestoreBackup(req: Request, res: Response) {
        try {
            if (!req.files || Object.keys(req.files).length === 0) {
                throw new CustomError('Nenhuma planilha foi enviada', 400)
            }

            res.status(200).json(await this.db.restoreBackup(req.files.backup_file as UploadedFile))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }




    async DecryptBackup(req: Request, res: Response) {
        try {
            if (!req.body.encrypted_filename) throw new Error('Selecione o arquivo para descriptografar!')

            const encryptedFilePath = path.join(__dirname, '../backup', req.body.encrypted_filename)
            const { readStream, filePath } = await this.db.decryptBackup(encryptedFilePath)

            readStream.pipe(res)
            readStream.on('end', () => fs.unlinkSync(filePath))
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }




    async Authenticate(req: Request, res: Response) {
        try {
            res.status(200).json(this.db.authenticate)
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }




    async ClearDatabase(req: Request, res: Response) {
        try {
            res.status(200).json(await this.db.clearDatabase())
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }




    async CreateIndex(req: Request, res: Response) {
        try {
            res.status(200).json(this.db.createIndex)
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }





    async UpdateIndex(req: Request, res: Response) {
        try {
            res.status(200).json(this.db.updateIndex)
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }





    async DropIndex(req: Request, res: Response) {
        try {
            res.status(200).json(this.db.dropIndex)
        } catch (error: any) {
            res.status(error.status || 500).json({ error: error.message })
        }
    }

}


export default DatabaseController