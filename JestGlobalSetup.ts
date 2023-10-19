import 'jest'
import Database from './src/db/Database'

export default async () => {
    const db = new Database()
    await db.syncModels()
    await db.clearDatabase()
}