if [[ $VERCEL_ENV == "production"  ]] ; then 
  terraform init
  terraform apply -auto-approve
else 
  terraform init
  terraform apply -auto-approve
fi