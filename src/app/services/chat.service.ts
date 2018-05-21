import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { firebase } from '@firebase/app';

import { Mensaje } from '../interfaces/mensaje.interface';

@Injectable()
export class ChatService {
  private itemsCollection: AngularFirestoreCollection<Mensaje>;
  public chats:Mensaje[] = [];
  public usuario:any = {};

  constructor(private afs: AngularFirestore,
              public afAuth: AngularFireAuth) {

                afAuth.authState.subscribe(user => {
                  console.log("Estado Usuario: ", user);

                  if(!user){
                    return;
                  }

                  this.usuario.nombre = user.displayName;
                  this.usuario.uid = user.uid;
                });

              }

  login() {
    this.afAuth.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }

  logout() {
    this.usuario = {};
    this.afAuth.auth.signOut();
  }

  cargarMensajes(){
    this.itemsCollection = this.afs.collection<Mensaje>('chats', ref => ref.orderBy('fecha','desc')
                                                                           .limit(10));

    return this.itemsCollection.valueChanges()
               .map((mensajes:Mensaje[]) => {
                 this.chats = [];
                 for(let mensaje of mensajes){
                   this.chats.unshift(mensaje);
                 }
                 return this.chats;
               });
  }

  agregarMensaje(texto:string){
    //TODO falta el UID del usuario
    let mensaje:Mensaje = {
      nombre: 'Demo',
      mensaje: texto,
      fecha: new Date().getTime()
    }

    return this.itemsCollection.add(mensaje);
  }

}
