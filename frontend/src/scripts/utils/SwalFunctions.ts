declare var Swal:any;
export function showWarning(msg: string) {
  Swal.fire({
    title: "warning!",
    text: msg,
    icon: "warning",
    confirmButtonText: "OK",
  })
}

export function showSuccess(msg: string) {
  Swal.fire({
    title: "success!",
    text: msg,
    icon: "success",
    confirmButtonText: "OK",
  })

}

export function editFeature(msg:string) {
  Swal.fire({
    title: "Are you sure?",
    text: msg,
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    cancelButtonColor: "#64748B",
    confirmButtonText: "Yes, Edit it",
    confirmButtonColor: "#DC2626",
  })

}

export async function deleteFeature(id: number, msg:string):Promise<void> {
  Swal.fire({
    title: "Are you sure?",
    text: "This will be deleted and can't be recover later",
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: "Cancel",
    cancelButtonColor: "#64748B",
    confirmButtonText: "Yes, Delete it",
    confirmButtonColor: "#DC2626",
    
  })
  .then((result: any) => {
    if (result.isConfirmed) {
      Swal.fire({
        title: "Deleted",
        text: msg,
        icon: "success",
        confirmButtonText: "OK",
      });
  
      
    }
  });
}


(window as any).showWarning = showWarning;
(window as any).showSuccess = showSuccess;
(window as any).deleteFeature = deleteFeature;
(window as any).editFeature = editFeature;