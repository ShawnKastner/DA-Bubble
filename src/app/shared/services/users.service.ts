import { Injectable, inject } from '@angular/core';
import { Firestore, collection, collectionData, doc, docData, query } from '@angular/fire/firestore';
import { Observable, of, switchMap } from 'rxjs';
import { Auth, UserProfile, authState } from '@angular/fire/auth';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root',
})
export class UsersService {
	firestore: Firestore = inject(Firestore);

	currentUser$ = authState(this.auth); // observable with the current user

	constructor(private auth: Auth, private authService: AuthService) {}

 /**
  * The `get getUsers(): Observable<any[]>` is a getter method that returns an observable of an array of users.
  * 
  * @method
  * @name (get) getUsers
  * @kind property
  * @memberof UsersService
  * @returns {Observable<any[]>}
  */
	get getUsers(): Observable<any[]> {
		const userCollection = collection(this.firestore, 'users'); // ´collection to obtain the reference to the collection 'users'
		const queryAll = query(userCollection); // query to obtain all the documents in the collection
		return collectionData(queryAll) as Observable<any[]>; // return the observable with the data
	}

 /**
  * The `currentUserProfile$` getter method is returning an observable of type `UserProfile | null`.
  * 
  * @method
  * @name (get) currentUserProfile$
  * @kind property
  * @memberof UsersService
  * @returns {$: Observable<UserProfile | null>}
  */
	get currentUserProfile$(): Observable<UserProfile | null> {
		return this.authService.currentUser$.pipe(
			switchMap((user) => {
				if (!user?.uid) {
					return of(null);
				}
				const ref = doc(this.firestore, 'users', user.uid);
				return docData(ref) as Observable<UserProfile>;
			})
		);
	}
}
