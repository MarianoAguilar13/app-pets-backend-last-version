import { Op, col, fn, where } from "sequelize";
import { sequelize } from "../db/conection";
import { User, Pet } from "../db/index";
import { cloudinary } from "../lib/cloudinary";

export async function getPet(idPet: number) {
  const pet = await Pet.findByPk(idPet);
  return pet;
}

export async function crearPublicacionPet(
  name: string,
  type: string,
  description: string,
  bodyData,
  localidad: string,
  provincia: number,
  lost: boolean,
  userId: number
) {
  if (bodyData.pictureDataURL) {
    //Cargo la imagen a cloudinary para que me genere una url y guardar
    //esa url en la db en postgre

    const imagen = await cloudinary.uploader.upload(bodyData.pictureDataURL, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });

    //  const imagen = { secure_url: bodyData.pictureDataURL };
    //creo la publicacion de la pet y en picURL, va la url de la imagen
    //de la pet guardada en cloudinary
    const newPet = await Pet.create({
      name: name,
      type: type,
      description: description,
      picURL: imagen.secure_url,
      localidad: localidad,
      provincia: provincia,
      lost: lost,
      userId: userId,
    });

    return newPet;
  } else {
    return false;
  }
}

export async function editarPublicacionPet(
  name: string,
  type: string,
  description: string,
  bodyData,
  localidad: string,
  provincia: string,
  lost: boolean,
  petId: number,
  userId: number
) {
  let url;
  // si bodyData.pictureDataURL tiene un tamaño mayor a 1000 caracteres,
  //significa que tiene la data de una nueva imagen, sino ya nos da la url

  if (bodyData.pictureDataURL.length >= 1000) {
    const imagen = await cloudinary.uploader.upload(bodyData.pictureDataURL, {
      resource_type: "image",
      discard_original_filename: true,
      width: 1000,
    });

    url = imagen.secure_url;
  } else {
    url = bodyData.pictureDataURL;
  }

  const petModificada = await Pet.update(
    {
      name: name,
      type: type,
      description: description,
      picURL: url,
      localidad: localidad,
      provincia: provincia,
      lost: lost,
    },
    {
      where: {
        //indico cual es la pet a la que le modifico los datos
        id: petId,
      },
    }
  );

  return petModificada;
}

export async function petsByLocalidad(loc: string) {
  try {
    //consulta para que me traiga todos las mascotas de la localidad total o parcial
    //que indica el usuarios
    const petsEncontradas = await Pet.findAll({
      where: where(fn("UPPER", col("localidad")), {
        [Op.like]: `%${(loc as string).toUpperCase()}%`,
      }),
    });
    if (petsEncontradas[0]) {
      return petsEncontradas;
    } else {
      return false;
    }
  } catch (error) {
    console.log(error);
    return false;
  }
}
