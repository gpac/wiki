rm spell.txt 2> /dev/null

function check()
{
#echo "check $1"
name=$1
bname=$(basename $1)

do_check=0
case $bname in
 _*.md )
  do_check=0;;
 *-Implementation-Status*)
  return;;
 *Player-Config*)
  return;;
 *Player-Features*)
  return;;
 *.git* )
  return;;
 *.md )
  do_check=1;;
esac

if [ -d "$name" ] ; then
for i in "$name"/* ; do
check $i
done

elif [ $do_check = 1 ] ; then
aspell --lang=en --personal=./aspell_dict_gpac.txt list < "$name" > tmp.txt

if [ -s tmp.txt ] ; then
echo "Source file $name" >> spell.txt
cat tmp.txt >> spell.txt 
fi
rm tmp.txt

fi

}

for i in * ; do
check $i

done


if [ -s spell.txt ] ; then
echo "Needs fixing"
else
echo "All OK"
fi