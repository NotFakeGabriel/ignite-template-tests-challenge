import { AppError } from "../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { OperationType } from "../../entities/Statement";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceUseCase } from "./GetBalanceUseCase"


let inMemoryStatementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUsecase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase

describe("Get Balance", () => {

  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUsecase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )

  })

  it("shuld be able to get a user statements", async () => {
    const user = {
      name: "User test",
      email: "test@example.com",
      password: "password"
    }
    const createdUser = await createUserUsecase.execute(user);
    await createStatementUseCase.execute({
      user_id: createdUser.id as string,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "test deposit statement"
    })
    const statements = await getBalanceUseCase.execute({ user_id: createdUser.id as string })
    expect(statements).toHaveProperty("balance");
  });

  it("shuld not be able to get a user statements from an inexistent user", async () => {
    expect(async () => {
      const user = {
        name: "User test",
        email: "test@example.com",
        password: "password"
      }
      const createdUser = await createUserUsecase.execute(user);
      await createStatementUseCase.execute({
        user_id: createdUser.id as string,
        type: OperationType.DEPOSIT,
        amount: 100,
        description: "test deposit statement"
      })
      await getBalanceUseCase.execute({ user_id: "inexistentUserId" })
    }).rejects.toBeInstanceOf(AppError)
  });
})
