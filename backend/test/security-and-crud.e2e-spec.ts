import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { AllExceptionsFilter } from '../src/common/filters/http-exception.filter';

describe('Testes de Segurança e CRUD (e2e)', () => {
  let app: INestApplication<App>;
  let authToken: string;
  let createdImovelId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new AllExceptionsFilter());
    await app.init();

    // Obter token de autenticação para os testes de escrita
    const loginRes = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: process.env.ADMIN_EMAIL || 'admin@imperium.com',
        senha: process.env.ADMIN_PASSWORD || 'admin123',
      });

    expect(loginRes.status).toBe(200);
    expect(loginRes.body).toHaveProperty('accessToken');
    authToken = loginRes.body.accessToken;
  });

  afterAll(async () => {
    // Limpeza de segurança caso algum teste tenha deixado resquício
    if (createdImovelId) {
      await request(app.getHttpServer())
        .delete(`/imoveis/${createdImovelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .catch(() => null);
    }
    await app.close();
  });

  describe('🛡️ Testes de Segurança e Controle de Acesso', () => {
    it('deve bloquear criação de imóvel sem token com 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer())
        .post('/imoveis')
        .send({
          titulo: 'Imóvel Não Autorizado',
          descricao: 'Tentativa sem auth',
          tipo: 'casa',
          cidade: 'Florianópolis',
          endereco: 'Rua Teste, 123',
          preco: 500000,
          quartos: 2,
          banheiros: 1,
          vagasGaragem: 1,
        });

      expect(res.status).toBe(401);
      expect(res.body.message).toMatch(/Autenticação necessária/i);
    });

    it('deve bloquear requisição com token JWT forjado/inválido com 401 Unauthorized', async () => {
      const res = await request(app.getHttpServer())
        .post('/imoveis')
        .set('Authorization', 'Bearer token_falso_invalido')
        .send({});

      expect(res.status).toBe(401);
    });

    it('deve bloquear tentativa de SSRF em resolver-maps apontando para URL maliciosa/interna com 400 Bad Request', async () => {
      const res = await request(app.getHttpServer())
        .get('/imoveis/resolver-maps')
        .query({ url: 'http://169.254.169.254/latest/meta-data/' });

      expect(res.status).toBe(400);
      expect(res.body.message).toMatch(/não foi possível extrair as coordenadas/i);
    });
  });

  describe('🧱 Testes de Validação Estrita de Dados (DTOs)', () => {
    it('deve rejeitar payload vazio ou incompleto com 400 Bad Request', async () => {
      const res = await request(app.getHttpServer())
        .post('/imoveis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({});

      expect(res.status).toBe(400);
      expect(Array.isArray(res.body.message)).toBe(true);
    });

    it('deve rejeitar título que exceda o tamanho máximo de 150 caracteres com 400', async () => {
      const tituloGigante = 'A'.repeat(151);
      const res = await request(app.getHttpServer())
        .post('/imoveis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          titulo: tituloGigante,
          descricao: 'Descrição normal',
          tipo: 'apartamento',
          cidade: 'Florianópolis',
          endereco: 'Rua Teste, 100',
          preco: 300000,
          quartos: 2,
          banheiros: 1,
          vagasGaragem: 1,
        });

      expect(res.status).toBe(400);
      expect(res.body.message.some((m: string) => m.includes('150 caracteres'))).toBe(true);
    });

    it('deve rejeitar valor fora da lista permitida (ex: tipo de imóvel inválido)', async () => {
      const res = await request(app.getHttpServer())
        .post('/imoveis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          titulo: 'Imóvel Teste',
          descricao: 'Descrição válida',
          tipo: 'disco-voador', // inválido
          cidade: 'Florianópolis',
          endereco: 'Rua Teste, 100',
          preco: 300000,
          quartos: 2,
          banheiros: 1,
          vagasGaragem: 1,
        });

      expect(res.status).toBe(400);
      expect(res.body.message.some((m: string) => m.includes('Tipo de imóvel inválido'))).toBe(true);
    });

    it('deve rejeitar propriedades extras não permitidas (forbidNonWhitelisted)', async () => {
      const res = await request(app.getHttpServer())
        .post('/imoveis')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          titulo: 'Imóvel Teste',
          descricao: 'Descrição válida',
          tipo: 'apartamento',
          cidade: 'Florianópolis',
          endereco: 'Rua Teste, 100',
          preco: 300000,
          quartos: 2,
          banheiros: 1,
          vagasGaragem: 1,
          campoHackerMalicioso: 'dados_indesejados',
        });

      expect(res.status).toBe(400);
      expect(res.body.message.some((m: string) => m.includes('should not exist'))).toBe(true);
    });
  });

  describe('🧪 Teste de Resiliência contra Injeção de SQL e XSS', () => {
    it('deve aceitar e armazenar com segurança caracteres especiais sem quebrar consultas SQL', async () => {
      const payloadInjecao = {
        titulo: "Apartamento ' OR '1'='1'; --",
        descricao: "<script>alert('xss')</script> Teste seguro de caracteres",
        tipo: 'apartamento',
        cidade: "Florianópolis'; DROP TABLE \"User\"; --",
        endereco: 'Rua das Ostras, 50',
        preco: 450000,
        quartos: 2,
        banheiros: 1,
        vagasGaragem: 1,
      };

      const res = await request(app.getHttpServer())
        .post('/imoveis')
        .set('Authorization', `Bearer ${authToken}`)
        .send(payloadInjecao);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.titulo).toBe("Apartamento ' OR '1'='1'; --");

      // Limpar o registro criado
      await request(app.getHttpServer())
        .delete(`/imoveis/${res.body.id}`)
        .set('Authorization', `Bearer ${authToken}`);
    });

    it('deve executar busca com caracteres de injeção no endpoint de listagem retornando 200 de forma segura', async () => {
      const res = await request(app.getHttpServer())
        .get('/imoveis')
        .query({ busca: "' OR '1'='1' --" });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });
  });

  describe('🛠️ Testes de Ciclo Completo do CRUD (Create, Read, Update, Delete)', () => {
    it('1. Create: Deve criar um novo imóvel com sucesso (201)', async () => {
      const novoImovel = {
        titulo: 'Apartamento Teste de Integração',
        descricao: 'Imóvel criado pelo teste de integração e2e',
        tipo: 'apartamento',
        cidade: 'Florianópolis',
        estado: 'SC',
        bairro: 'Centro',
        endereco: 'Rua Bocaiúva, 150',
        preco: 750000,
        quartos: 3,
        banheiros: 2,
        vagasGaragem: 1,
        status: 'disponivel',
        finalidade: 'venda',
      };

      const res = await request(app.getHttpServer())
        .post('/imoveis')
        .set('Authorization', `Bearer ${authToken}`)
        .send(novoImovel);

      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.titulo).toBe(novoImovel.titulo);
      expect(res.body.preco).toBe(750000);
      createdImovelId = res.body.id;
    });

    it('2. Read (Lista): Deve listar os imóveis com filtro (200)', async () => {
      const res = await request(app.getHttpServer())
        .get('/imoveis')
        .query({ tipo: 'apartamento', cidade: 'Florianópolis' });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.some((item: any) => item.id === createdImovelId)).toBe(true);
    });

    it('3. Read (Detalhe): Deve retornar os detalhes do imóvel criado pelo ID (200)', async () => {
      const res = await request(app.getHttpServer()).get(`/imoveis/${createdImovelId}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdImovelId);
      expect(res.body.titulo).toBe('Apartamento Teste de Integração');
      expect(Array.isArray(res.body.midias)).toBe(true);
    });

    it('4. Read (Não Encontrado): Deve retornar 404 para ID inexistente', async () => {
      const res = await request(app.getHttpServer()).get('/imoveis/99999999');

      expect(res.status).toBe(404);
      expect(res.body.message).toMatch(/não encontrado/i);
    });

    it('5. Update (PATCH): Deve atualizar parcialmente o imóvel com sucesso (200)', async () => {
      const alteracao = { preco: 720000, status: 'reservado' };

      const res = await request(app.getHttpServer())
        .patch(`/imoveis/${createdImovelId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send(alteracao);

      expect(res.status).toBe(200);
      expect(res.body.preco).toBe(720000);
      expect(res.body.status).toBe('reservado');
    });

    it('6. Delete: Deve remover o imóvel com sucesso (200)', async () => {
      const res = await request(app.getHttpServer())
        .delete(`/imoveis/${createdImovelId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(res.status).toBe(200);
      expect(res.body.id).toBe(createdImovelId);
    });

    it('7. Read pós-deleção: Deve confirmar exclusão retornando 404', async () => {
      const res = await request(app.getHttpServer()).get(`/imoveis/${createdImovelId}`);

      expect(res.status).toBe(404);
      createdImovelId = 0; // Marca como já limpo
    });
  });
});

