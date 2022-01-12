#
# prettyprint.pl   - crude perl script to read .avsc files and print in human readable form.
#
# perl prettyprint.pl avsc_input_filename > output_filename
#
# NOTE:  This script expects there to be at least one space between all of the keywords, values, etc. 
#         for perl to split the pieces separated by space.  
#
#         This should be replaced by the better python verson whenever it is completed.  
#
# MODS: 
# 1/10/22 TBS Add section for handling null. 
#
use strict;
use warnings;

sub read_avsc_file {
   my ($avsc_filename) = @_; 
   ##print "In sub: avsc_filename = $avsc_filename\n";

   my ($space, $recname, $token);

   open (my $subfh, $avsc_filename) or die "Could not open subfile: $avsc_filename."; 
   while (my $row = <$subfh>) {
     chomp $row;

  if ($row =~ /\bname\b/ && $. < 6) {
     ##print "Found record name! name = ";
     $row =~ s/"//g;
     $row =~ s/,//g;
     $row =~ s/\name\://;
     ($token, $recname) = split(" ",$row);
     print "\n$recname\n"; 

     ##print "\n$space.$recname\n";
  }
  if ($row =~ /fields/) {
     ##print "Found fields! fields = ";
     while (my $subrow = <$subfh>) {
        chomp $subrow;
        next if  ($subrow !~ /name/); 
        ##print "$subrow\n";
        $subrow =~ s/"//g;
        $subrow =~ s/,//g;
        $subrow =~ s/{//g;
        $subrow =~ s/}//g;
        $subrow =~ s/\name\://;
        my ($part1, $part2, $part3, $part4, $part5, @rest) = split(" ",$subrow);
        if ($subrow =~ /enum/) {
           my $part7 = shift(@rest); 
           my $part8 = shift(@rest); 
           my $part9 = shift(@rest); 
           printf "%35s %8s ",$part2, $part8;
           print "   @rest\n"; 
        } elsif ($subrow =~ /\bmap\b/) {
           my $part7 = shift(@rest); 
           my $part8 = shift(@rest); 
           my $part9 = shift(@rest); 
           printf "%35s %8s ",$part2, "map";
           print "   @rest\n"; 
        } elsif ($subrow =~ /\barray\b/) {
           my $part7 = shift(@rest); 
           my $part8 = shift(@rest); 
           my $part9 = shift(@rest); 
           my $part10 = shift(@rest); 
           my $part11 = shift(@rest); 
           printf "%35s %8s ",$part2, "array";
           print "   @rest\n"; 
        } elsif ($subrow =~ /\bboolean\b/) {
           my $part7 = shift(@rest); 
           my $part8 = shift(@rest); 
           printf "%35s %8s ",$part2, $part4;
           print "   @rest\n"; 
        } elsif ($subrow =~ /\bnull\b/) {
           my $part7 = shift(@rest); 
           ##my $part8 = shift(@rest); 
           $part4 =~ s/\[//;
           printf "%35s %8s ",$part2, $part4;
           print "   @rest\n"; 
        } else {
          printf "%35s %8s ", $part2, $part4; 
          print "   @rest\n"; 
        }

     }
  }
  #print "$row\n";
   }
   close($subfh); 
}
 
##my $filename = 'gcn.notices.fermi.lat.grbposini.avsc';

my $filename = $ARGV[0]; 
open(my $fh, '<:encoding(UTF-8)', $filename)
  or die "Could not open file '$filename' $!";

my ($token, $space, $recname, $subname, $subfilename); 
 
while (my $row = <$fh>) {
  chomp $row;

  if ($row =~ /namespace/) {
     ##print "In namespace if: \n";
     $row =~ s/"//g;
     $row =~ s/,//g;
     $row =~ s/\"""namespace\"""\://;
     ($token, $space) = split(" ",$row);
     ##print "space = $space\n"; 
  }
  if ($row =~ /\bname\b/ && $. < 6) {
     ##print "In name if: ";
     $row =~ s/"//g;
     $row =~ s/,//g;
     $row =~ s/\name\://;
     ($token, $recname) = split(" ",$row);
     ##print "recname = $recname\n"; 

     print "\nSCHEMA NAMESPACE: $space.$recname\n";
  }
  if ($row =~ /fields/) {
     ##print "Found fields! fields = ";
     while (my $subrow = <$fh>) {
        chomp $subrow;
        next if  ($subrow !~ /name/); 
        ##print "$subrow\n";
        $subrow =~ s/"//g;
        $subrow =~ s/,//g;
        $subrow =~ s/{//g;
        $subrow =~ s/}//g;
        $subrow =~ s/\name\://;
        my ($part1, $part2, $part3, $part4) = split(" ",$subrow);
        ##print "\npart4=$part4\n"; 
        my $subfile = "$part4.avsc";
        ##print "subfilename = $subfile\n"; 
        read_avsc_file($subfile); 
     }
  }
  #print "$row\n";
}
