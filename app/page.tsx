import { PrismaClient } from '@prisma/client'
import Interface from './interface';

const prisma = new PrismaClient()

async function getPatient() {
  let patient = await prisma.patientData.findFirst({
      include: {
          appointments: true
      }
  });

  // If no patient is found, create one
  if (!patient) {
      await prisma.patientData.create({
          data: {
              first_name: 'Alice',
              last_name: 'Johnson',

              dob: new Date('1990-01-01'),
              gender: 'F',

              email: 'alice124356@gmail.com',

              comments: 'Family history of shingles',
              appointments: {
                  create: {
                      date: new Date('2022-01-01'),
                      symptoms: 'Mild fever'
                  },
              },
          }
      })
      patient = await prisma.patientData.findFirst({
          include: {
              appointments: true
          }
      });
  }
  return patient;
}

export default async function Home() {
  const patient = await getPatient();
  return (
    <section className="flex flex-col sm:gap-2 sm:pb-20 h-full flex-1 w-1/2">
        <Interface firstname={patient?.first_name || 'Guest' } />
    </section>
  );
}