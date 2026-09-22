import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...');

  // 1. Garantir Usuário Administrador
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@imperium.com';
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      nome: 'Administrador Imperium',
      email: adminEmail,
      senha: hashedPassword,
      role: 'admin',
    },
  });
  console.log(`✅ Usuário administrador garantido: ${admin.email}`);

  // 2. Criar Imóveis de Demonstração caso não existam
  const count = await prisma.imovel.count();
  if (count === 0) {
    console.log('Populando imóveis de demonstração...');

    await prisma.imovel.create({
      data: {
        titulo: 'Apartamento de Alto Padrão na Beira Mar',
        descricao:
          'Apartamento finamente mobiliado e decorado, com 3 suítes, ampla sacada gourmet com churrasqueira a carvão, vista panorâmica permanente para o mar e 3 vagas de garagem.',
        tipo: 'apartamento',
        cidade: 'Florianópolis',
        estado: 'SC',
        bairro: 'Centro',
        endereco: 'Av. Beira Mar Norte, 2500',
        preco: 2850000.0,
        status: 'disponivel',
        finalidade: 'venda',
        quartos: 3,
        banheiros: 4,
        vagasGaragem: 3,
        latitude: -27.5858,
        longitude: -48.5486,
        ocultarNumeroExato: false,
        midias: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
              nome: 'fachada_luxo.jpg',
              tipo: 'imagem',
              mimeType: 'image/jpeg',
              resourceType: 'image',
            },
            {
              url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
              nome: 'sala_estar.jpg',
              tipo: 'imagem',
              mimeType: 'image/jpeg',
              resourceType: 'image',
            },
          ],
        },
      },
    });

    await prisma.imovel.create({
      data: {
        titulo: 'Casa Contemporânea em Condomínio Fechado',
        descricao:
          'Residência espetacular com conceito aberto, piscina com borda infinita, energia solar fotovoltaica, 4 suítes e acabamentos de altíssima qualidade.',
        tipo: 'casa',
        cidade: 'Florianópolis',
        estado: 'SC',
        bairro: 'Jurerê Internacional',
        endereco: 'Rua dos Pampas, 180',
        preco: 5900000.0,
        status: 'disponivel',
        finalidade: 'venda',
        quartos: 4,
        banheiros: 5,
        vagasGaragem: 4,
        latitude: -27.4419,
        longitude: -48.5024,
        ocultarNumeroExato: true,
        midias: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
              nome: 'casa_jurere.jpg',
              tipo: 'imagem',
              mimeType: 'image/jpeg',
              resourceType: 'image',
            },
          ],
        },
      },
    });

    await prisma.imovel.create({
      data: {
        titulo: 'Cobertura Duplex com Vista 360 Graus',
        descricao:
          'Cobertura exclusiva duplex com piscina privativa no terraço, espaço gourmet integrado, automação residencial completa e vista para a baía.',
        tipo: 'cobertura',
        cidade: 'Florianópolis',
        estado: 'SC',
        bairro: 'Agronômica',
        endereco: 'Rua Rui Barbosa, 450',
        preco: 4200000.0,
        status: 'disponivel',
        finalidade: 'venda',
        quartos: 4,
        banheiros: 4,
        vagasGaragem: 3,
        latitude: -27.5762,
        longitude: -48.5377,
        ocultarNumeroExato: false,
        midias: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
              nome: 'cobertura_duplex.jpg',
              tipo: 'imagem',
              mimeType: 'image/jpeg',
              resourceType: 'image',
            },
          ],
        },
      },
    });

    await prisma.imovel.create({
      data: {
        titulo: 'Studio Moderno para Locação no Centro',
        descricao:
          'Ideal para profissionais e investidores. Totalmente mobiliado, próximo a universidades, bancos, restaurantes e comércio.',
        tipo: 'apartamento',
        cidade: 'Florianópolis',
        estado: 'SC',
        bairro: 'Centro',
        endereco: 'Rua Felipe Schmidt, 600',
        preco: 3200.0,
        status: 'disponivel',
        finalidade: 'locacao',
        quartos: 1,
        banheiros: 1,
        vagasGaragem: 1,
        latitude: -27.5954,
        longitude: -48.5521,
        ocultarNumeroExato: false,
        midias: {
          create: [
            {
              url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
              nome: 'studio_centro.jpg',
              tipo: 'imagem',
              mimeType: 'image/jpeg',
              resourceType: 'image',
            },
          ],
        },
      },
    });

    console.log('✅ 4 imóveis de demonstração criados com sucesso!');
  } else {
    console.log(`ℹ️ Banco já possui ${count} imóveis cadastrados. Nenhum registro duplicado adicionado.`);
  }

  console.log('🎉 Seed finalizado com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a execução do seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

