### Implementation plan :

#### Schemas:
1. User
2. Bucket(N->1 with User) --> owning side
   3. As of now lets make it--> bucket can be created but not sub subcket as of now
3. FileMetadata--> to be saved to the db
   4. Bucket --> FileMetadata [1-->N]  :: FileMetadata is the owning side then