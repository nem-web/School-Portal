import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

export async function openCamera() {
  // Request permission (Android + iOS)
  await Camera.requestPermissions({ permissions: ["camera"] });

  const image = await Camera.getPhoto({
    quality: 90,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera
  });

  return `data:image/jpeg;base64,${image.base64String}`;
}
